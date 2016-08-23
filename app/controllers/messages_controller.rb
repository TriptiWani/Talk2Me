  require 'open-uri'

  class MessagesController < ApplicationController

  def create
    # binding.pry
    if (params[:content]).present?
      message = Message.new
      req = Cloudinary::Uploader.upload(params[:content])
      message.content = req["url"]
      message.user_id = @current_user.id
      # message.category = params[:category]
      message.group_id = params[:group_id]
    # message = Message.new(message_params)
    else
      message = Message.new(message_params)
      message.content = params[:message][:content]
      message.user_id = @current_user.id
      # binding.pry
    end
    if message.save
      ActionCable.server.broadcast 'messages',
        message: message.content,
        user: message.user.name,
        category: message.category,
        id: message.user.id,
        created_at: message.created_at
      # head :ok
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
