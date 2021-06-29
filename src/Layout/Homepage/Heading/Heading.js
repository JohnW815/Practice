import React,{ useState, useEffect, useRef, useContext } from 'react'
import { Navbar, NavbarBrand,NavbarToggler, Nav, NavItem, NavLink, UncontrolledDropdown,
        DropdownToggle, DropdownItem, DropdownMenu, Collapse, Button } from 'reactstrap'
import { connect } from 'react-redux';
import firebase from '../../../Config/firebase'
import { Link } from 'react-router-dom'

const Heading = (props) => {
    const[isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const [claim,setClaim] = useState();

    useEffect(() => {
        if(!props.auth.isEmpty){
            firebase.auth().currentUser.getIdTokenResult()
                .then((claim) => {
                    console.log(claim);
                })
        }
    },[props.auth])

    return(
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">My blog</NavbarBrand>
                <NavbarToggler onClick={toggle}/>
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/new-article">New Article</NavLink>
                            </NavItem>
                        </Nav>
                        {
                            props.auth.isEmpty ?
                            '':
                            props.auth.displayName
                        }
                        <UncontrolledDropdown>
                            <DropdownToggle nav caret>
                                Option
                            </DropdownToggle>
                            <DropdownMenu right>
                                {
                                    props.auth.isEmpty ?
                                        <DropdownItem>
                                            <Link to={{pathname : '/login'}}>
                                                Login
                                            </Link>
                                        </DropdownItem>
                                        :
                                        <DropdownItem>
                                            <Button onClick={() => firebase.auth().signOut()}>
                                                Logout
                                            </Button>
                                        </DropdownItem>
                                }
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Collapse>
            </Navbar>
        </div>
    );

}

const enhance = connect(
    ({firebase: {auth, profile}}) => ({
        auth,
        profile
    })
)

export default enhance(Heading)