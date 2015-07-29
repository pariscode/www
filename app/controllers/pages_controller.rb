# app/controllers/pages_controller.rb
class PagesController < ApplicationController


  def show
    I18n.locale = params[:locale]
    render params[:template]
  end


end