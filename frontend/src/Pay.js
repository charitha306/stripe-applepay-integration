import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class Pay extends Component {

    constructor(props) {
        super(props);
        this.state = {clients: ""};
        // this.get = this.get.bind(this);
    }

    componentDidMount() {
        fetch('/v1/test')
        .then((response) => response.json())
        //Then with the data from the response in JSON...
        .then((data) => {
            this.setState({clients : data.key})
            // console.log('Success:', data.key);
        })
    }

    // async get(id) {
    //     await fetch(`/v1/test`, {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         }
    //     }).then((data) => {
    //         // let updatedClients = [...this.state.clients].filter(i => i.id !== id);
    //         this.setState({clients: data});
    //     });
    // }

    render() {
        // const {clients} = this.state.clients;

        // const clientList = <tr >
        //         <td style={{whiteSpace: 'nowrap'}}>{clients}</td>
        //         <td>{clients}</td>
        //         <td>
        //             <div>{clients}</div>
        //             {/*<ButtonGroup>*/}
        //             {/*    <Button size="sm" color="primary" tag={Link} to={"/clients/" + client.id}>Edit</Button>*/}
        //             {/*    <Button size="sm" color="danger" onClick={() => this.remove(client.id)}>Delete</Button>*/}
        //             {/*</ButtonGroup>*/}
        //         </td>
        //     </tr>
        // ;

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div>
                        testing!!!
                        {/*<Button color="success" tag={Link} to="/clients/new">Add Client</Button>*/}
                    </div>
                    <div>{this.state.clients}</div>
                    {/*<h3>Clients</h3>*/}
                    {/*<Table className="mt-4">*/}
                    {/*    <thead>*/}
                    {/*    <tr>*/}
                    {/*        <th width="30%">Name</th>*/}
                    {/*        <th width="30%">Email</th>*/}
                    {/*        <th width="40%">Actions</th>*/}
                    {/*    </tr>*/}
                    {/*    </thead>*/}
                    {/*    <tbody>*/}
                    {/*    {clientList}*/}
                    {/*    </tbody>*/}
                    {/*</Table>*/}
                </Container>
            </div>
        );
    }
}

export default Pay;
