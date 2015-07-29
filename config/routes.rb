Rails.application.routes.draw do

  STATIC_PAGES = {
    home: { path: '' },
    apply: { locale_path: { en: 'apply', fr: 'postuler' }},
    thanks: { locale_path: { en: 'thanks', fr: 'merci' }},
    program: { locale_path: { en: 'program', fr: 'programme' }},
    press: { locale_path: { en: 'press', fr: 'presse' }},
    faq: { path: 'faq' },
    jobs: { path: 'jobs' }
  }

  CITIES = %w(paris brussels beyrouth bordeaux lille marseille)

  STATIC_PAGES.each do |template, path_details|
    if path_details[:locale_path]
      path_details[:locale_path].each do |locale, page|
        get ":page" => "pages#show", page: /#{page}/, template: template, locale: locale
      end
    end
    if path_details[:path]
      scope "(:locale)", locale: /fr|en/ do
        get ":page" => "pages#show", page: /#{path_details[:path]}/, template: template
      end
    end
  end

  scope "(:locale)", locale: /fr|en/ do
    get "alumni" => "students#index"
    get ":city" => "cities#show", city: /#{CITIES.join('|')}|/
    resources :projects, only: [:show]
    resources :students, only: [:show]
  end

  # Blog (TODO)

end
