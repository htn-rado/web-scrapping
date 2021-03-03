import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import './style/bootstrap.min.css';
import './style/style.css';
import {dataJobs} from "./data/data-jobs";
import { Icon, Pagination } from "semantic-ui-react";

class App extends Component {

    state = {
        data: dataJobs,
        perPage: 20,
        dataPaginator: [],
        cities: [],
        keyCities: [],
        resultNumber: null,
        filterCity: '',
        filterKeyCity: '',
        filterJob: '',
    }

    handleSearchFilter = (event) => {
        const {value, name} = event.target;
        this.setState({ [name]: value }, () => {
            this.filterList();
        }); // use setState callback to now filter the list

    };

    filterList = () => {
        const { filterJob, filterCity, filterKeyCity } = this.state;
        const itemsUpdate = dataJobs.filter(item => {
            const filterJobRes = item.title.toLowerCase().indexOf(filterJob.toLowerCase()) >= 0;
            const filterCityRes = item.location.toLowerCase().indexOf(filterCity.toLowerCase()) >= 0;
            const filterKeyCityRes = item.location.toLowerCase().indexOf(filterKeyCity.toLowerCase()) >= 0;
            return filterJobRes && filterCityRes && filterKeyCityRes;
            // Change the above condition to or if you wish to do an OR check
        })
        this.setState({ dataPaginator: itemsUpdate.slice(0, this.state.perPage) });
    }

    ClickPagination = (event, data) => {
        const { perPage } = this.state
        this.setState({
            dataPaginator: this.state.data.slice(data.activePage * perPage - perPage, data.activePage * perPage)
        });
    }

    componentDidMount() {

        this.setState({ dataPaginator: dataJobs.slice(0, this.state.perPage) })

        const { data } = this.state;
        let cityData = [];
        let keyCitiesData = [];
        for (const job of data ) {
            if (job.location !== null) {
                if (!cityData.find(x => x === job.location.split('(')[0].trim())) {
                    cityData.push(job.location.split('(')[0].trim());
                }
                if (job.location.match(/\(([^)]+)\)/) !== null) {
                    if (!keyCitiesData.find(x => x === job.location.match(/\(([^)]+)\)/)[1])) {
                        keyCitiesData.push(job.location.match(/\(([^)]+)\)/)[1]);
                    }
                }
            }

        }
        this.setState({cities: cityData});
        this.setState({keyCities: keyCitiesData});
    }

    render() {

        const { data, dataPaginator, perPage } = this.state;

        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-9">
                            {dataPaginator.map((job, i) => (
                                <div key={job.title + i} className="job">
                                    <h4>{job.title}</h4>
                                    <div className="company">{job.company}</div>
                                    <div><span className="location">{job.location}</span> <span>{job.smallLocation}</span> <span>{job.ratingsContent}</span></div>
                                    <div>{job.remote}</div>
                                    <div className="salary">{job.salary}</div>
                                    <div>{job.summary}</div>
                                </div>
                            ))}

                            {data.length > perPage && (
                                <div className="pagination-blog">
                                    <Pagination
                                        boundaryRange={1} defaultActivePage={1}
                                        totalPages={Math.ceil(data.length / perPage)}
                                        onPageChange={this.ClickPagination}
                                        ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                        prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                        nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="col-md-3">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="exampleFormControlInput1">Travail</label>
                                    <input onChange={this.handleSearchFilter} value={this.state.filterJob} name="filterJob" type="text" className="form-control" id="exampleFormControlInput1" placeholder="travail..." />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleFormControlSelect1">Ville</label>
                                    <select className="form-control" id="exampleFormControlSelect1" onChange={this.handleSearchFilter} name="filterCity">
                                        {this.state.cities.map((city, i) => (
                                            <option key={i}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleFormControlSelect1">Code de la Ville</label>
                                    <select className="form-control" id="exampleFormControlSelect1" onChange={this.handleSearchFilter} name="filterKeyCity">
                                        {this.state.keyCities.map((keyCity, i) => (
                                            <option key={i}>{keyCity}</option>
                                        ))}
                                    </select>
                                </div>
                            </form>
                            {this.state.resultNumber !== null && (<span>{this.state.resultNumber} résultats trouvés</span>)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
