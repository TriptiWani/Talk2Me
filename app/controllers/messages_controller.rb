  require 'open-uri'

  class MessagesController < ApplicationController

  def create
    if (params[:content]).present?
      if ((params[:content] =~ /^{.*:(\-?\d*\.?\d*).*:(\-?\d*\.?\d*)}/).eql?0)
        message_latitude = $1
        message_longitude = $2
        message = Message.new
        location_url = "http://maps.google.com/maps/api/staticmap?size=200x200&sensor=false&zoom=16&markers=#{message_latitude}%2C#{message_longitude}"
        req = Cloudinary::Uploader.upload(location_url)
        message.content = req["url"]
        message.user_id = @current_user.id
        message.group_id = params[:group_id]
      else
        message = Message.new
        req = Cloudinary::Uploader.upload(params[:content])
        message.content = req["url"]
        message.user_id = @current_user.id
        message.group_id = params[:group_id]
      end

    else
      message = Message.new(message_params)
      if ((params[:message][:content] =~ /^NLOC({.*:(\-?\d*\.?\d*).*:(\-?\d*\.?\d*)})/).eql?0)
        message_latitude_longitude = $1
        message.content = message_latitude_longitude
      elsif ((params[:message][:content] =~ /^NTEXT(.*)/).eql?0)
        image_url = $1
        req = Cloudinary::Uploader.upload(image_url)
        message.content = req["url"]
      else
        message.content = params[:message][:content]
      end

      message.user_id = @current_user.id
    end
    if message.save
      ActionCable.server.broadcast 'messages',
        message: message.content,
        user: message.user.name,
        category: message.category,
        id: message.user.id,
        created_at: message.created_at,
        group_id: message.group_id,
        message_id: message.id
      respond_to do |format|
        format.html  # index.html.erb
        format.json  { render :json => message, :status => :ok }
      end
    else
      redirect_to groups_path
    end
  end

  private

    def message_params
      params.require(:message).permit(:content, :group_id)
    end
end
