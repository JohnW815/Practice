import React,{ useState,useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom'
import Heading from '../Homepage/Heading/Heading';
import Main from '../Homepage/Main/Main';
import ViewArticle from '../ViewArticle/ViewArticle'
import NewArticle from '../NewArticle/NewArticle'
import LoginPage from '../LoginPage/LoginPage'
import {connect} from 'react-redux'

import firebase from 'firebase'

const AdminOnly = (ComposedComponent, auth) => {
    const AdminOnly = (props) => {

        const [isPass,setIsPass] = useState(false);

        useEffect(() => {
            console.log(auth)
            if(!auth.isEmpty){
                firebase.auth().currentUser.getIdTokenResult()
                    .then((idTokenResult) =>{
                        if(idTokenResult.claims.type === 'administrator'){
                            setIsPass(true)
                        }else{
                        props.history.push('/login')}
                    })
            }else{
                props.history.push('/login')
            }
        },[props.data])

        if(isPass){
            return <ComposedComponent location={props.location} history={props.history} auth={auth}/>;
        }else{
            return(<div>checking</div>);
        }

    }

    return AdminOnly;
}

const RouterManager = (props) => {

    console.log(props.auth);

    return(
       <div>
           <Heading />
           {
                props.auth.isLoaded?
                <Switch>
                   <Route path="/" exact>
                       <Main />
                   </Route>
                   <Route path="/login">
                       <LoginPage />
                   </Route>
                   <Route path="/article/:id">
                       <ViewArticle />
                   </Route>
                   <Route path='/new-article' component={AdminOnly(NewArticle, props.auth)}>
                   </Route>
               </Switch>
               :''
           }
       </div>
    );
};

const enhance = connect(
    ({firebase: {auth, profile}}) => ({
        auth,
        profile
    })
)

export default enhance(withRouter(RouterManager));