import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: [],
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    
    this.props.firebase.getUsers().then(querySnapshot => {
      const usersList = querySnapshot.docs.map(doc => doc.data())
      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>
        <h1>Admin</h1>

        {loading && <div>Loading ...</div>}
        <UserList users={users} />
      </div>
    );
  }
}

const UserList = ({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
        <br />
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <br />
        <span>
          <strong>UID:</strong> {user.uid}
        </span>
      </li>
    ))}
  </ul>
);

export default withFirebase(AdminPage);