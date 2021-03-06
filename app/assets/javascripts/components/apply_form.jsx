class ApplyForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeCity: this.props.city,
      activeBatch: this.firstBatch(this.props.city),
      submitting: false
    }
  }

  render() {

    var batches = this.state.activeCity.batches;

    var componentClasses = classNames({
      'apply-form': true
    })

    var submitButton = null;
    if (this.state.submitting) {
      submitButton = (
        <input type='submit' value={this.props.i18n.please_wait} disabled className='apply-form-submit btn btn-sucsess' />
        );
    } else {
      submitButton = (
        <input type='submit' value={this.props.i18n.apply_btn + this.state.activeCity.name} className='apply-form-submit btn btn-sucsess' />
        );
    }

    return(
      <div className={componentClasses}>
        <div className="banner-container">
          <div className="container banner-city-container">
            <div className='banner-city-nav'>
              {this.props.cities.map((city) => {
                return (
                  <CityNavItem
                    city={city}
                    setActiveCity={(city) => this.setActiveCity(city)}
                    isActive={this.state.activeCity.slug == city.slug}
                  />
                )
              })}
            </div>
            <div className='apply-form-body'>
              <div className='banner-city-wrapper'>

                {this.props.cities.map((city) => {

                  var bannerClasses = classNames({
                    'banner-city banner banner-top banner-gradient text-center': true,
                    'is-active': this.state.activeCity.slug == city.slug
                  })

                  var bannerCityStyle = {
                    backgroundImage: "url('" + city.pictures.city.cover  + "');"
                  };


                  return(
                    <div className={bannerClasses} style={bannerCityStyle}>
                      <div className="banner-gradient-shadow"></div>
                      <div className="banner-content">
                        <h1 className='glitch'>
                          {this.props.i18n.title} <span className='city'>{city.name}</span>
                        </h1>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className='apply-form-rows-container'>
                <form action={Routes.apply_path()} method='post' onSubmit={this.onSubmit.bind(this)}>
                  <div dangerouslySetInnerHTML={{__html: Csrf.getInput()}}></div>
                  <div className="apply-form-row apply-form-row-first" >
                    <label>
                      <i className='mdi mdi-calendar-multiple-check'></i>Dates
                    </label>
                    <div className="apply-form-row-item">
                      <div className='post-submissions-select'>
                        <ReactBootstrap.DropdownButton ref='selectType' title={'from ' + this.state.activeBatch.starts_at + ' to ' + this.state.activeBatch.ends_at}>
                          {batches.map((batch) => {
                            return(
                              <BatchSelector
                                batch={batch}
                                isActive={batch.id == this.state.activeBatch.id}
                              />
                            )
                          })
                          }
                        </ReactBootstrap.DropdownButton>
                        <input type='hidden' name='application[batch_id]' value={this.state.activeBatch.id} />
                        <input type='hidden' name='application[city_id]' value={this.state.activeCity.id} />
                      </div>
                    </div>
                  </div>
                  {this.props.rows.map( (row, index) => {
                    return <ApplyFormRow {... row} />
                  })}
                  <div className='apply-form-row-submit'>
                    <div className='apply-form-price'>
                      Price: {this.state.activeBatch.price} {this.props.i18n.conditions}
                    </div>
                    {submitButton}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    PubSub.subscribe('setActiveBatch', (msg, data) => {
      this.setState({
        activeBatch: data
      })
    })
  }

  setActiveCity(city) {
    if (this.state.activeCity !== city) {
      this.setState({ activeCity: city, activeBatch: this.firstBatch(city) })
    }
  }

  firstBatch(city) {
    return _.filter(city.batches, (n) => { return !n.full })[0] // to take the first not full batch.
  }

  onSubmit() {
    this.setState({ submitting: true });
  }
}
