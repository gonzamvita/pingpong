import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import { withTranslation } from 'react-i18next';

const withAuthUser = Component => {
    function WithAuthUser(props) { //componente, mayus recibe props devuelve algo que se renderiza
        const authUser = React.useContext(AuthUserContext)
        return (
            <Component {...props} authUser={authUser} withTranslation={withTranslation}/>
        );
    }
    return withFirebase(WithAuthUser);
}

export default withAuthUser;