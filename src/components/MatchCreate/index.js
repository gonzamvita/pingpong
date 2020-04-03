import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { FormHelperText, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { withAuthUser } from '../Session';
import * as ROUTES from '../../constants/routes';

class MatchCreatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            users: [],
            match: {},
        };
        console.log(this.props)
    }

    onSubmit = (e) => {
        const { match } = this.state;
        this.props.firebase
            .addMatch(match)
            .then(() => {
                this.props.history.push(ROUTES.MATCH);
            })
            .catch(error => {
                this.setState({ error });
            });
        e.preventDefault()
    }

    onOpen = (e) => {
        if (this.state.loading) {
            this.props.firebase.getUsers()
                .then(querySnapshot => {
                    const usersList = querySnapshot.docs.map(doc => doc.data())
                    this.setState({
                        users: usersList.filter((u) => u.uid !== this.props.authUser.uid),
                        loading: false,
                        currentUser: this.props.authUser,
                    });
                });
        }
        e.preventDefault()
    }

    onChange = (e, value) => {
        this.setState({
            match: {
                opponent: value.uid,
                host: this.state.currentUser.uid
            }
        }
        );
    };

    render() {
        const { users, loading } = this.state;

        console.log(this.props)
        return (
            <div>
                <h1>Match</h1>
                <form>
                    <FormHelperText>Select a player to play the match with:</FormHelperText>
                    <Autocomplete
                        id="opponent"
                        loading={loading}
                        autoComplete={true}
                        options={users}
                        onChange={this.onChange}
                        onOpen={this.onOpen}
                        style={{ width: 300 }}
                        getOptionLabel={(user) => user.username}
                        renderInput={(params) => <TextField {...params} label="Opponent" variant="outlined" />}
                    />
                    <Button type="submit" variant="contained" onClick={e => this.onSubmit(e)}>Create</Button>
                </form>
            </div>
        );
    }
}

const NewMatchLink = () => (
    <p>
        <Link to={ROUTES.MATCH_CREATE}>New Match!</Link>
    </p>
);

export default withAuthUser(MatchCreatePage);
export { NewMatchLink };