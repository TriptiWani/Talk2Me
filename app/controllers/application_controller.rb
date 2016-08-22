class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :fetch_user

  private
  def fetch_user
    # search for a user by their user id if we can find one in the session hash
    if session[:user_id].present?
      @current_user = User.find_by :id => session[:user_id]
        #clear out the session user_id if no user is found
        session[:user_id] = nil unless @current_user
    end

  end
end
