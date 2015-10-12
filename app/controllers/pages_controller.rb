# app/controllers/pages_controller.rb
class PagesController < ApplicationController
  before_action :set_locale
  before_action :set_client

  def home
    @stories = @client.stories
    @alumni = @client.alumni
    @projects = @client.projects
    @cities = @client.cities
    @meetups = Hash.new
    @cities.each do |city|
      if city["meetup_id"].present?
        meetup_cli = MeetupApiClient.new(city["meetup_id"])
        @meetups[city['slug']] = { events: meetup_cli.meetup_events, infos: meetup_cli.meetup  }
      end
    end
  end

  def thanks
  end

  def apply
    @cities = @client.cities.select {|city| city['next_batch']}.each do |city|
      city['next_batch']['starts_at'] = city['next_batch']['starts_at'].to_date.strftime('%b %d, %Y')
      city['next_batch']['ends_at'] = city['next_batch']['ends_at'].to_date.strftime('%b %d, %Y')
    end
  end

  private

  def set_locale
    I18n.locale = params[:locale]
  end

  def set_client
    @client = AlumniClient.new
  end
end
