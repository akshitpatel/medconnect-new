require "test_helper"

class Api::PatientControllerTest < ActionDispatch::IntegrationTest
  test "should get dashboard" do
    get api_patient_dashboard_url
    assert_response :success
  end

  test "should get appointments" do
    get api_patient_appointments_url
    assert_response :success
  end

  test "should get symptom_search" do
    get api_patient_symptom_search_url
    assert_response :success
  end
end
