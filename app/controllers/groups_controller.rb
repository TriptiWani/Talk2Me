class GroupsController < ApplicationController

  def index
    raw_groups = @current_user.groups
    @groups = []
    raw_groups.each do|group|
      @groups.push(group) if group.is_active.eql?true
    end
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
      redirect_to @group
    else
      render :new
    end
  end

  def show
    if (params[:message_count]).present?
      @message_count = (params[:message_count]).to_i
      @message_count+= 10
    else
      @message_count = 10
    end
    @group = Group.find_by(:id => params[:id])
    if @group.is_active.eql?false
      redirect_to root_path
    else

      is_member = ''
      @message = Message.new
      if !(@group.users.include?(@current_user))
        flash[:alert] = 'Either this group does not exist or is not created by you'
        redirect_to root_path
      end
    end
  end

  def edit
    @group = Group.find_by :id => params[:id]
    if @group.is_active.eql?false
      redirect_to root_path
    end

  end

  def update
    @group = Group.find_by :id => params[:id]
    if @group.is_active.eql?false
      redirect_to root_path
    end
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
    @group.is_active = false
    @group.save

    redirect_to groups_path
  end

  def add_users_to_group

     user_to_be_added = User.find_by :id=> (params[:search_term]).to_i
     @group_to_add = Group.find_by :id=> params[:group_id]
     contact_already_exists = @group_to_add.users.include?(user_to_be_added)
    if contact_already_exists
      user_to_be_added = 'Contact is already added'
      render :json => user_to_be_added, :status => :ok
    else
      if user_to_be_added.present? && @group_to_add.present? && (@current_user.id).eql?(@group_to_add.grp_admin_id)
        @group_to_add.users << user_to_be_added
      elsif (user_to_be_added.present? && @group_to_add.present?) && !(@current_user.id).eql?(@group_to_add.grp_admin_id)
        user_to_be_added = 'Please request group admin to add this member'
      else
        flash[:notice] = 'User not present'
      end
      render :json =>user_to_be_added, :status => :ok
    end
  end

  def remove_user_from_group
    group_id = params[:group_id]
    user_id = params[:user_id]
    @group = Group.find_by(:id => group_id)
    user = User.find_by( :id => user_id)
    if (@current_user.id).eql?(@group.grp_admin_id)
      (@group.users).delete(user)
    end

    redirect_to @group
  end

  private
  def group_params
    params.require(:group).permit(:grp_name, :grp_image)
  end
end
