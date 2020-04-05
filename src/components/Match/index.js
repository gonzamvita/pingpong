import React, { Component } from 'react';
import MatchSummaryCard from '../MatchSummary'
import { withFirebase } from '../Firebase';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import * as ROUTES from '../../constants/routes';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const INITIAL_MATCH_STATE = {
    player1Id: '',
    player2Id: '',
    status: 'pending',
    date: null,
    winnerId: null,
};

class MatchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            matches: [],
            filteredMatches: [],
            all: true,
            ranked: false,
            finished: false,
            ...INITIAL_MATCH_STATE
        };
        this.handleFilterChange = this.handleFilterChange.bind(this)
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
        console.log("MatchPage -> handleFilterChange -> name, value", name, value)
        this.setState({ [name]: value })
    }

    render() {
        const { t } = this.props;

        const { filteredMatches, loading, all, ranked, finished } = this.state;
        const filters = { all, ranked, finished }
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
        console.log(event.target.checked);
        this.props.onFilterChange(event.target.name, event.target.checked)
    }

    render() {
        const { t } = this.props;

        return (
            <FormControl component="fieldset">
                <FormLabel component="legend">Match Filter</FormLabel>
                <FormGroup row>
                    <FormControlLabel
                        control={<Switch checked={this.props.filters.all} onChange={this.handleChange} name="all" />}
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
                <FormHelperText>Be careful</FormHelperText>
            </FormControl>
        )
    }
}

export default withFirebase(withTranslation()(MatchPage));