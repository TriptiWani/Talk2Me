class GroupsController < ApplicationController
  def index
    @groups = @current_user.groups
  end

  def new
    @group = Group.new
  end

  def create
    @group = Group.new group_params
    @group.grp_admin_id = @current_user.id
    if (params[:file]).present?
      req = Cloudinary::Uploader.upload(params[:file])
      @group.grp_image = req["url"]
    end
    if @group.save
      @group.users << @current_user
      # Contact.create(:user_id => @current_user.id , :group_id => @group.id)
      redirect_to @group
    else
      render :new
    end
  end

  def show
    @group = Group.find_by(:id => params[:id])
    is_member = ''
    # @group.contacts.each do |contact|
    #   is_member = contact.user if (contact.user).eql?@current_user
    # end
    @message = Message.new
    # binding.pry
    if !(@group.users.include?(@current_user))
      flash[:alert] = 'Either this group does not exist or is not created by you'
      redirect_to root_path
    end
  end

  def edit
    @group = Group.find_by :id => params[:id]
  end

  def update
    @group = Group.find_by :id => params[:id]

    if ( (@group.grp_admin_id ).eql?(@current_user.id))
      if (params[:file]).present?
        req = Cloudinary::Uploader.upload(params[:file])
        @group.grp_image = req["url"]
      end
      @group.update group_params
      redirect_to @group
    else
      flash[:alert] = 'Access Denied'
      redirect_to @group
    end

  end

  def destroy
    @group = Group.find_by :id => params[:id]
    @group.destroy
  end

  def add_users_to_group

     user_to_be_added = User.find_by :id=> (params[:search_term]).to_i
     @group_to_add = Group.find_by :id=> params[:group_id]
     contact_already_exists = @group_to_add.users.include?(user_to_be_added)
    if contact_already_exists
      flash[:alert] = 'Contact is already added'
    else
      if user_to_be_added.present? && @group_to_add.present?
        flash[:notice] = 'Added the contact'
        @group_to_add.users << user_to_be_added
        # contact = Contact.create(:user_id => user_to_be_added.id , :group_id => @group_to_add.id)
        # contact.save
      else
        flash[:notice] = 'User not present'
      end
    end
    render :json =>user_to_be_added, :status => :ok
    # render :json => @group, :include => :users, :status => :ok
  end

  def remove_user_from_group
    group_id = params[:group_id]
    user_id = params[:user_id]
    @group = Group.find_by(:id => group_id)
    user = User.find_by( :id => user_id)

    (@group.users).delete(user)
    redirect_to @group
  end

  private
  def group_params
    params.require(:group).permit(:grp_name, :grp_image)
  end
end
