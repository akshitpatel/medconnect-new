class AuditLog < ApplicationRecord
  belongs_to :user, optional: true

  enum :severity, { info: 0, warning: 1, error: 2, critical: 3 }
  enum :status, { success: 0, failure: 1 } # Optional, depending on usage

  # Consider making resource polymorphic if needed: belongs_to :resource, polymorphic: true
end
