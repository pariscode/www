require "blog"

class PostsController < ApplicationController
  def index
    @posts = Blog.new.all
  end

  def show
    @post = Blog.new.post(params[:slug])
    @pushed_posts = Blog.new.pushed_posts
  end
end
