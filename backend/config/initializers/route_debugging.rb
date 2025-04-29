# config/initializers/route_debugging.rb

# Middleware to catch routing errors and log detailed information
class RouteDebuggingMiddleware
  def initialize(app)
    @app = app
  end

  def call(env)
    # Try to route the request
    status, headers, response = @app.call(env)
    
    # If the response is a 404, log detailed information
    if status == 404
      request = ActionDispatch::Request.new(env)
      Rails.logger.error("[ROUTE ERROR] 404 Not Found for: #{request.method} #{request.path}")
      Rails.logger.error("[ROUTE ERROR] Available routes for this path pattern:")
      
      # Get path components for partial matching
      path_components = request.path.split('/').reject(&:empty?)
      
      # Log similar routes that might be what the user intended
      Rails.application.routes.routes.each do |route|
        if route.path.spec.to_s.include?(path_components.last) || 
           path_components.any? { |comp| route.path.spec.to_s.include?(comp) }
          Rails.logger.error("  - #{route.verb} #{route.path.spec} => #{route.defaults[:controller]}##{route.defaults[:action]}")
        end
      end
    end
    
    [status, headers, response]
  end
end

# Insert the middleware near the top of the stack for early error detection
Rails.application.config.middleware.insert_after Rack::Runtime, RouteDebuggingMiddleware
