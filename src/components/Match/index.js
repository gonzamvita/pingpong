import React, { Component } from 'react';
import MatchSummaryCard from '../MatchSummary'
import { withAuthUser } from '../Session';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import * as ROUTES from '../../constants/routes';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

class MatchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            matches: [],
            filteredMatches: [],
            mymatches: false,
            ranked: false,
            finished: false
        };
        this.handleFilterChange = this.handleFilterChange.bind(this)
        this.matchFilterFn = {
            mymatches: (arr, value) => arr.filter(m => (value.test(m.host_uid) || value.test(m.host_uid))),
            finished: (arr, value) => arr.filter(m => m.status === value),
            ranked: (arr, value) => arr.filter(m => m.match_type === value),
        }
        this.matchFilterValues = {
            mymatches: (value) => value ? new RegExp(this.props.authUser.uid, 'g') : new RegExp(/\w*/, 'g'),
            finished: (value) => value ? 'finished' : 'pending',
            ranked: (value) => value ? 'ranked' : 'friendly'
        }
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.getMatches().then(querySnapshot => {
            const matchesList = querySnapshot.docs.map(doc => doc.data())
            this.setState({
                matches: matchesList,
                filteredMatches: matchesList,
                loading: false,
            });
        });
    }

    handleFilterChange(name, value) {
        this.setState({ [name]: value }, this.doFilterChange())
    }

    doFilterChange() {
        const { mymatches, ranked, finished, matches } = this.state
        let filters = { mymatches, ranked, finished }
        let newFilteredMatches
        for (const key in filters) {
            newFilteredMatches = this.matchFilterFn[key](matches, this.matchFilterValues[key](filters[key]))
        }
        this.setState({ filteredMatches: newFilteredMatches })
    }

    render() {
        const { t } = this.props;

        const { filteredMatches, loading, mymatches, ranked, finished } = this.state;
        const filters = { mymatches, ranked, finished }
        return (
            <div>
                <h1>{t('matches')}</h1>
                <div>
                    <FilterGroup filters={filters} onFilterChange={this.handleFilterChange} />
                </div>
                <div>
                    <Button variant="contained" color="primary">
                        <Link to={ROUTES.MATCH_CREATE} style={{ color: '#FFF' }}>{t('new_match')}</Link>
                    </Button>
                </div>
                {loading && <div>Loading ...</div>}
                <MatchList matches={filteredMatches} />
            </div>
        );
    }
}

const MatchList = ({ matches }) => (
    <div style={{ width: '100%', padding: 20 }}>
        <Grid
            container
            spacing={3}
            direction="row-reverse"
            justify="flex-start"
            alignItems="stretch"
        >
            {
                matches.map((match, i) => (
                    <Grid item xs key={i}>
                        <MatchSummaryCard match={match} />
                    </Grid>
                ))
            }
        </Grid>
    </div>
);

class FilterGroup extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onFilterChange(event.target.name, event.target.checked)
    }

    render() {
        return (
            <FormControl component="fieldset">
                <FormLabel component="legend">Match Filter</FormLabel>
                <FormGroup row>
                    <FormControlLabel
                        control={<Switch checked={this.props.filters.mymatches} onChange={this.handleChange} name="mymatches" />}
                        label="My matches"
                    />
                    <FormControlLabel
                        control={<Switch checked={this.props.filters.finished} onChange={this.handleChange} name="finished" />}
                        label="Finished Matches"
                    />
                    <FormControlLabel
                        control={<Switch checked={this.props.filters.ranked} onChange={this.handleChange} name="ranked" />}
                        label="Ranked Matches"
                    />
                </FormGroup>
            </FormControl>
        )
    }
}

export default withAuthUser(withTranslation()(MatchPage));