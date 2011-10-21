Rails.application.config.middleware.use OmniAuth::Builder do
  
  if Rails.env.development?
    provider :facebook, '208356915880593', '39f25e85529aae23d87c77bfca6aae9d',
      :iframe => true,
      :scope => "publish_stream,email,user_education_history"
  else 
    provider :facebook, '242295279129203', '2fc600c92bf11b26cdaf598dde5bc095',
      :iframe => true,
      :scope => "publish_stream,email,user_education_history"
  end

end