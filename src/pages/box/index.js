import React, { Component } from 'react';
import api from '../../services/api'
import logo from '../../assets/logo.svg';
import { MdInsertDriveFile } from 'react-icons/md';
import Dropzone from 'react-dropzone';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import socket from 'socket.io-client';

import './styles.css';

export default class Box extends Component {
    state = {
        box: {}
    }

    async componentDidMount() {
        this.subscribeToNewFiles();

        const box = this.props.match.params.id;
        const responde = await api.get(`boxes/${box}`);

        this.setState({ box: responde.data })
    }

    subscribeToNewFiles = () => {
        const box = this.props.match.params.id;
        const io = socket('https://omnistack-backend-danilo.herokuapp.com');

        io.emit('connectRoom', box);
        io.on('file', data => {
            this.setState({ box: { ...this.state.box, files: [data,...this.state.box.files, ]}})
        });
    }

    handleUpdload = (files) => {
        files.forEach(file => {
            const data = new FormData();
            data.append('file', file);
            const box = this.props.match.params.id;

            api.post(`boxes/${box}/files`, data);
        });
    }

    render() {
        return (
            <div id="box-container">
                <header>
                    <img src={logo} alt="" />
                    <h1>{this.state.box.title}</h1>
                </header> 

                <ul>
                    {this.state.box.files && this.state.box.files.map(file => (
                        <li key={file._id}>
                            <a className="fileInfo" href={file.url} target="_blank">
                                <MdInsertDriveFile size={24} color="#A5Cfff" />
                                <strong>{file.title}</strong>
                            </a>

                            <span>há{" "} {distanceInWords(file.createdAt, new Date(), {
                                locale: pt
                            })}</span>
                        </li>
                    ))
                    }

                </ul>

                <Dropzone onDropAccepted={this.handleUpdload}>
                    {({ getRootProps, getInputProps }) => (
                        <div className="upload" { ...getRootProps() }>
                            <input {...getInputProps()} />

                            <p>Arraste arquivos ou clique aqui</p>
                        </div>     
                    )}
                </Dropzone>   
            </div>
        );
    }
}
