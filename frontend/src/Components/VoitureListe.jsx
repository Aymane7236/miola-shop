import React, { Component } from 'react';
import { Card, Table, Button, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig';
import MyToast from './MyToast';

export default class VoitureListe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voitures: [],
      show: false
    };
  }

  componentDidMount() {
    axios.get('/voitures')
      .then(response => {
        this.setState({ voitures: response.data });
      });
  }

  deleteVoiture = (voitureId) => {
    axios.delete('/voitures/' + voitureId)
      .then(() => {
        this.setState({
          voitures: this.state.voitures.filter(v => v.id !== voitureId),
          show: true
        });
        setTimeout(() => this.setState({ show: false }), 3000);
      });
  };

  render() {
    const { voitures, show } = this.state;
    return (
      <div>
        <div style={{ display: show ? 'block' : 'none' }}>
          <MyToast children={{
            show,
            message: 'Voiture supprimée avec succès.',
            type: 'danger'
          }} />
        </div>

        <Card className="border border-dark bg-dark text-white">
          <Card.Header>
            <FontAwesomeIcon icon={faList} /> Liste des Voitures
          </Card.Header>
          <Card.Body>
            <Table bordered hover striped variant="dark">
              <thead>
                <tr>
                  <th>Marque</th>
                  <th>Modele</th>
                  <th>Couleur</th>
                  <th>Immatricule</th>
                  <th>Annee</th>
                  <th>Prix</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {voitures.length === 0 ? (
                  <tr align="center">
                    <td colSpan="7">Aucune Voiture n'est disponible</td>
                  </tr>
                ) : (
                  voitures.map(voiture => (
                    <tr key={voiture.id}>
                      <td>{voiture.marque}</td>
                      <td>{voiture.modele}</td>
                      <td>{voiture.couleur}</td>
                      <td>{voiture.immatricule}</td>
                      <td>{voiture.annee}</td>
                      <td>{voiture.prix}</td>
                      <td>
                        <ButtonGroup>
                          <Link
                            to={`/edit/${voiture.id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>{' '}
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={this.deleteVoiture.bind(this, voiture.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
