require "test_helper"

class Api::AdminControllerTest < ActionDispatch::IntegrationTest
  test "should get dashboard" do
    get api_admin_dashboard_url
    assert_response :success
  end

  test "should get users" do
    get api_admin_users_url
    assert_response :success
  end
end
