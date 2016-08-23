module MessagesHelper

  def check_msg_type(message)
    image_types = ['jpg','jpeg','png','gif']
    message_type = ''
    if message =~ URI::regexp
      message_last = message.split('.').last
      if (image_types.include?message_last)
            p "its image"
            # upload to cloudinary
            message_type = 'image'
      else
        p "its link"
        # create a tag
        message_type = 'link'
      end
    else
      p "its plain text"
      message_type = 'text'
      # display the plain text
    end
  end

end
