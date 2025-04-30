class AddProviderTypeToProviderProfiles < ActiveRecord::Migration[6.1]
  def change
    add_column :provider_profiles, :provider_type, :string, default: 'doctor'
    add_column :provider_profiles, :facility_details, :jsonb, default: {}
    add_column :provider_profiles, :equipment, :string, array: true, default: []
    add_column :provider_profiles, :insurance_providers, :string, array: true, default: []
    add_column :provider_profiles, :operating_hours, :jsonb, default: {}
    add_index :provider_profiles, :provider_type
  end
end
