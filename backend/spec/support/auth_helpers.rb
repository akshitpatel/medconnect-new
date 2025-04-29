# spec/support/auth_helpers.rb
module AuthHelpers
  def auth_headers(user)
    token = user.generate_jwt
    {
      'Authorization' => "Bearer #{token}"
    }
  end

  # Method to simulate authenticated requests in tests
  def get_with_auth(path, user, **kwargs)
    get path, headers: auth_headers(user), **kwargs
  end
  
  def post_with_auth(path, user, **kwargs)
    post path, headers: auth_headers(user), **kwargs
  end
  
  def put_with_auth(path, user, **kwargs)
    put path, headers: auth_headers(user), **kwargs
  end
  
  def patch_with_auth(path, user, **kwargs)
    patch path, headers: auth_headers(user), **kwargs
  end
  
  def delete_with_auth(path, user, **kwargs)
    delete path, headers: auth_headers(user), **kwargs
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :request
end
