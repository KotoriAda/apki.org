source 'https://rubygems.org'


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 4.2.0'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
gem 'bootstrap-sass', '~> 3.3.4'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
# gem 'coffee-rails', '~> 4.1.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

gem 'sprockets-rails', :require => 'sprockets/railtie'

# rails_admin
gem 'rails_admin'

# MongoDB
gem 'mongoid', '~> 5'

#Slugi 
gem 'mongoid-slug'
# kompilator typescript
# gem 'typescript-rails'
# gem 'typescript-src', github: 'bdrazhzhov/typescript-src-ruby'
# Na chwilę obecną rezygnujemy z kompilacji TypeScript po stronie serwera (typescipt-rails pracuje z mocno przestarzałą wersją TS)

#tłumaczenia dla rails
gem 'rails-i18n'

# logowanie/rejestracja github
gem 'omniauth-github'

# edytor markdown
gem 'pagedown-bootstrap-rails'

# parser markdown
gem 'kramdown'

# edytor html do rails_admin
gem 'ckeditor'
# wgrywanie obrazków i plików
gem 'carrierwave-mongoid', :require => 'carrierwave/mongoid'
gem 'mini_magick'

# paginator
gem 'kaminari-mongoid'

# elastyczne formularze
gem 'simple_form'

# FontAwsome
gem 'font-awesome-rails'

# gem do żądań HTTP
gem 'faraday'

# API GitHub - octokit (oficjalne)
gem 'octokit', '~> 4'

# cachowanie zapytań http robionych przez faraday (używane przez octokit) https://github.com/plataformatec/faraday-http-cache
gem 'faraday-http-cache'

# komunikacja z api forum
# gem 'discourse_api'

# silnik do tworzenia prostych skryptów (do sprawdzania zadań)
gem 'dentaku', '~> 2'

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# wydajniejszy serwer lokalny
gem 'thin'

# AngularJS
gem 'angularjs-rails'

# Windows fixer
gem 'tzinfo-data'

gem 'rack-mini-profiler'
unless Gem.win_platform?
  gem 'flamegraph'
  gem 'stackprof'
  gem 'memory_profiler'
end

# Kolorowanie logów
gem 'shog'

# Lepsza inteaktywna konsola
gem 'pry-rails'

# Tryb maintenance w prosty sposób
gem 'turnout'

# Upload obrazków
gem 'simple_form_fancy_uploads'

group :production do
  # Cachowanie w redisie
  unless Gem.win_platform?
    gem 'hiredis'
    gem 'readthis'
    gem 'redis-session-store'
  end
end

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  # gem 'byebug'

  gem 'rake'

  gem 'better_errors'
  gem 'quiet_assets'
  gem 'binding_of_caller'
  gem 'meta_request'

  gem 'rails-dev-tweaks', '~> 1.1'

  gem 'rspec-rails', '~> 3.0'
  gem 'factory_girl_rails'
  gem 'capybara'
  gem 'launchy'

  #gem 'did_you_mean'


  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'
end

gem 'newrelic_rpm', group: [:production]

# deploy
group :development do
  gem 'mina', '~> 0.3.8', require: false
  gem 'mina-multistage', require: false
end
