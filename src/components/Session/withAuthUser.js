import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthUser = Component => {
    function WithAuthUser(props) { //componente
        const authUser = React.useContext(AuthUserContext)
        return (
            <Component {...props} authUser={authUser} />
        );
    }
    return withFirebase(WithAuthUser);
}

export default withAuthUser;