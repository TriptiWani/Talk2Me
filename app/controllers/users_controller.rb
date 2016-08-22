class UsersController < ApplicationController
  before_action :check_for_user, :only => [:edit, :update]

  def new
    @user = User.new
  end

  def create
    @user = User.new user_params
    if (params[:file]).present?
      req = Cloudinary::Uploader.upload(params[:file])
      @user.image = req["url"]
    end
    if @user.save
      session[:user_id] = @user.id
      flash[:notice] = 'Account successfully created'
      redirect_to @user
    else
      render :new
    end
  end

  def destroy
    @user = User.find_by :id => params[:id]
    @user.is_active = false
    @user.save
    session[:user_id] = nil

    redirect_to login_path
  end

  def index
    if params[:usernamesearch].present?
      @users = User.where('name ILIKE ?', '%' + params[:usernamesearch] + '%')
      # binding.pry
      redirect_to group_path(params[:group_id])
      #
      # respond_to do |format|
      #   format.js { redirect_to group_path(params[:group_id]) }
      # end


    else
      @users = User.where :is_active => true
    end

  end

  def incremental_search
    users = User.where('name ILIKE ?', '%' + params[:search_term] + '%').select("id, name")
    search_results = []
    users.each do |u|
      result = {:value => u.name , :data => u.id}
      search_results.push(result)
    end
    search_response = {
        "query": "Unit",
        "suggestions": search_results
    }
    render :json => search_response , :status => :ok
  end

  def edit
    @user = User.find_by :id => params[:id]
  end

  def update
    @user = User.find_by :id => params[:id]
    if (params[:file]).present?
      req = Cloudinary::Uploader.upload(params[:file])
      @user.image = req["url"]
    end
    @user.update user_params

    redirect_to @user
  end

  def show
    @user = User.find_by(:id => params[:id])
  end

  private
  def user_params
    params.require(:user).permit(:name, :password, :password_confirmation, :email_id, :facebook_id , :phone_number, :image)
  end

  def check_for_user
    flash[:notice] = 'Please login' unless @current_user.present?
    redirect_to new_user_path unless @current_user.present?
  end

end
