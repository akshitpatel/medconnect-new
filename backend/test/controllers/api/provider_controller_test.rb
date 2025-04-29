require "test_helper"

class Api::ProviderControllerTest < ActionDispatch::IntegrationTest
  test "should get dashboard" do
    get api_provider_dashboard_url
    assert_response :success
  end

  test "should get patients" do
    get api_provider_patients_url
    assert_response :success
  end
end
