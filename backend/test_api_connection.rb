#!/usr/bin/env ruby

require 'net/http'
require 'json'
require 'uri'

# Configuration
API_BASE_URL = 'http://localhost:3001/api/v1'

def make_request(method, endpoint, data = nil, token = nil)
  uri = URI("#{API_BASE_URL}#{endpoint}")
  
  case method.upcase
  when 'GET'
    request = Net::HTTP::Get.new(uri)
  when 'POST'
    request = Net::HTTP::Post.new(uri)
  when 'PUT'
    request = Net::HTTP::Put.new(uri)
  when 'DELETE'
    request = Net::HTTP::Delete.new(uri)
  end
  
  request['Content-Type'] = 'application/json'
  request['Authorization'] = "Bearer #{token}" if token
  
  if data
    request.body = data.to_json
  end
  
  http = Net::HTTP.new(uri.host, uri.port)
  http.read_timeout = 10
  
  begin
    response = http.request(request)
    {
      status: response.code.to_i,
      body: JSON.parse(response.body),
      headers: response.to_hash
    }
  rescue => e
    {
      status: 0,
      error: e.message,
      body: nil
    }
  end
end

def test_endpoint(name, method, endpoint, data = nil, token = nil)
  puts "\n🔍 Testing #{name}..."
  puts "   #{method.upcase} #{endpoint}"
  
  result = make_request(method, endpoint, data, token)
  
  if result[:status] == 0
    puts "   ❌ Connection failed: #{result[:error]}"
    return false
  elsif result[:status] >= 200 && result[:status] < 300
    puts "   ✅ Success (#{result[:status]})"
    puts "   📄 Response: #{JSON.pretty_generate(result[:body])}" if result[:body]
    return true
  else
    puts "   ❌ Failed (#{result[:status]})"
    puts "   📄 Response: #{JSON.pretty_generate(result[:body])}" if result[:body]
    return false
  end
end

def main
  puts "🚀 Testing MedConnect API Connection"
  puts "=================================="
  
  # Test 1: Health check
  test_endpoint("Health Check", "GET", "/test")
  
  # Test 2: User registration
  registration_data = {
    user: {
      full_name: "Test User",
      email: "test@example.com",
      password: "password123",
      password_confirmation: "password123",
      phone: "+1234567890",
      date_of_birth: "1990-01-01",
      gender: "male"
    }
  }
  
  registration_result = test_endpoint("User Registration", "POST", "/auth/register", registration_data)
  
  # Test 3: User login
  login_data = {
    user: {
      email: "test@example.com",
      password: "password123"
    }
  }
  
  login_result = test_endpoint("User Login", "POST", "/auth/login", login_data)
  
  # Extract token if login was successful
  token = nil
  if login_result && login_result[:body] && login_result[:body]['data'] && login_result[:body]['data']['token']
    token = login_result[:body]['data']['token']
    puts "\n🔑 Token extracted: #{token[0..20]}..."
  end
  
  # Test 4: Get current user (requires authentication)
  if token
    test_endpoint("Get Current User", "GET", "/auth/me", nil, token)
  end
  
  # Test 5: Patient profile (requires authentication)
  if token
    test_endpoint("Patient Profile", "GET", "/patients/profile", nil, token)
  end
  
  # Test 6: Patient appointments (requires authentication)
  if token
    test_endpoint("Patient Appointments", "GET", "/patients/appointments", nil, token)
  end
  
  # Test 7: Patient medications (requires authentication)
  if token
    test_endpoint("Patient Medications", "GET", "/patients/medications", nil, token)
  end
  
  # Test 8: Patient messages (requires authentication)
  if token
    test_endpoint("Patient Messages", "GET", "/patients/messages", nil, token)
  end
  
  # Test 9: Admin users (requires admin authentication)
  if token
    test_endpoint("Admin Users", "GET", "/admin/users", nil, token)
  end
  
  # Test 10: Provider dashboard (requires provider authentication)
  if token
    test_endpoint("Provider Dashboard", "GET", "/providers/dashboard", nil, token)
  end
  
  puts "\n✅ API Testing Complete!"
end

if __FILE__ == $0
  main
end