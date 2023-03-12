import React from 'react';
import TestAxios from '../../apis/TestAxios';
import { Row, Col, Button, Table, Form } from 'react-bootstrap'
import './../../index.css';
import { withParams, withNavigation } from '../../routeconf'

class Proizvod extends React.Component {

    constructor(props) {
        super(props);
    
        const search = {
            kategorijaId: "",
            minCena: "",
            maxCena: ""
        }
    
        this.state = {
            proizvodi: [],
            kategorije: [], 
            pageNo: 0,
            totalPages: 0,
            search: search
        }
    }

    componentDidMount() {
        this.getProizvodi(0);
        this.getKategorije();
        }

    getProizvodi(newPageNo) {
            let config = {
                params: {
                    kategorijaId: this.state.search.kategorijaId,
                    minCena: this.state.search.minCena,
                    maxCena: this.state.search.maxCena,
                    pageNo: newPageNo,
                }
            }
        
    TestAxios.get('/proizvodi', config)
                .then(res => {
                    console.log(res);
                    this.setState({
                        proizvodi: res.data,
                        pageNo: newPageNo,
                        totalPages : res.headers['total-pages']
                    });
                })
                .catch(error => {
                    // handle error
                    console.log(error);
                    alert('Error occured please try again!');
                });
        }
        

getKategorije(){
        TestAxios.get("/kategorije")
        .then((response)=>{
            this.setState({kategorije:response.data});
            })
        .catch((err=>{console.log(err)}));
        }
    
onInputChange(event) {
        const name = event.target.name;
        const value = event.target.value
        
        let search = this.state.search;
        search[name] = value;
        
        this.setState({ search })
        }

onNumberChange(event) {
        console.log(event.target.value);
        
        const { name, value } = event.target;
        console.log(name + ", " + value);
        
        this.setState((state, props) => ({
            kolicina: value}));
        }
        
    
delete(proizvodId) {
        TestAxios.delete('/proizvodi/' + proizvodId)
            .then(res => {
                    // handle success
                    console.log(res);
                    alert('Uspesno ste obrisali proizvod!');
                    window.location.reload();
                    })
                    .catch(error => {
                        // handle error
                        console.log(error);
                        alert('Doslo je do greske!');
                    });
            }
    
    goToAdd() {
            this.props.navigate('/proizvodi/add'); 
                 }
        
    Kupi(proizvod) {

            var params = {
                    'id': proizvod.id,
                    'stanje' : proizvod.stanje - this.state.kolicina,
                    'naziv' : proizvod.naziv,
                    'cena' : proizvod.cena,
                    'kategorijaId':proizvod.kategorijaId,
                    'kategorijaIme':proizvod.kategorijaNaziv
                }
        
        
            console.log(params)
        
            TestAxios.put("/proizvodi/" + proizvod.id, params)
            .then((res)=>{
                this.getProizvodi(0)
                alert("Uspesno obavljena kupovina")
                this.props.navigate("/proizvodi")
                window.location.reload();
                console.log(res)
            })
            .catch((err=>{
                alert("Nedovoljan broj proizvoda na stanju")
                this.props.navigate("/proizvodi")
                console.log(err)}));
        
        }
    Dodaj(proizvod) {

            var params = {
                    'id': proizvod.id,
                    'stanje' : parseInt(this.state.kolicina) +parseInt(proizvod.stanje),
                    'naziv' : proizvod.naziv,
                    'cena' : proizvod.cena,
                    'kategorijaId':proizvod.kategorijaId,
                    'kategorijaNaziv':proizvod.kategorijaNaziv
                }
        
        
            console.log(params)
        
            TestAxios.put("/proizvodi/" + proizvod.id, params)
            .then((res)=>{
                this.getProizvodi(0)
                alert("Uspesno obavljena kupovina")
                this.props.navigate("/proizvodi")
                window.location.reload();
                console.log(res)
            })
            .catch((err=>{
                alert("Neuspesna nabavaka")
                this.props.navigate("/proizvodi")
                console.log(err)}));
        
        }  

renderProizvodi() {
    return this.state.proizvodi.map((proizvod) => {

        const admin = window.localStorage['role'] == 'ROLE_ADMIN';
        const korisnik = window.localStorage['role'] == 'ROLE_KORISNIK';

    if(admin || korisnik) {
        return (
            <tr key={proizvod.id}>
                <td>{proizvod.naziv}</td>
                <td>{proizvod.cena}</td>
                <td>{proizvod.stanje}</td>

                {window.localStorage['role'] == 'ROLE_ADMIN' ?
                    [<td><Form.Group>
                        <Form.Control
                            name="kolicina"
                            as="input"
                            type="number"
                            placeholder='kolicina'
                            min={0}
                            onInput={(e) => this.onNumberChange(e)}></Form.Control>
                    </Form.Group></td>,
                    <td><Button variant="danger" onClick={() => this.delete(proizvod.id)}>Obrisite</Button></td>,
                    <td><Button variant="success" onClick={() => this.Dodaj(proizvod)}>Nabavite</Button></td>]:[null]}

                {window.localStorage['role'] == 'ROLE_KORISNIK' ?
                    [<td><td>
                        <Form.Control
                            name="kolicina"
                            as="input"
                            type="number"
                            placeholder='kolicina'
                            min={0}
                            onInput={(e) => this.onNumberChange(e)}></Form.Control>
                    </td>
                <td ><Button disabled={proizvod.stanje===0 || proizvod.stanje<this.state.kolicina } onClick={() => this.Kupi(proizvod)}>Kupite</Button></td></td>]:[null]
                }

            </tr>
        )
                } 
    })
        }
        
    renderSearchForm() {
            return (
                <>
                <Form style={{ width: "100%" }}>
                     <h3>Pretraga</h3>
                   
                     <Form>
                        <Row>
                            <Col>
                            <Form.Label>Minimalna Cena</Form.Label>
                            <Form.Control
                                name="minCena"
                                as="input"
                                type="number"
                                onChange={(e) => this.onInputChange(e)}></Form.Control>
                            </Col>
                            <Col>
                            <Form.Label>Maksimalna Cena</Form.Label>
                            <Form.Control
                                name="maxCena"
                                as="input"
                                type="number"
                                onChange={(e) => this.onInputChange(e)}></Form.Control>
                            </Col>
                        </Row>
                    </Form>

                    <Row><Col><Form.Group>
                            <Form.Label>Kategorija</Form.Label>
                            <Form.Select name="kategorijaId" onChange={(e)=>this.onInputChange(e)}>
                                <option value=""></option>
                                {this.state.kategorije.map((kategorije)=>{
                                    return(
                                        <option value={kategorije.id}>{kategorije.naziv}</option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                        
                    </Col></Row>
        
                </Form>
                <Row><Col>
                    <Button className="mt-3" onClick={() => this.getProizvodi(0)}>Pretrazite</Button>
                </Col></Row>
                </>
                
            );
        }

        render() {
            return (
                <Col>
            
                <Row><h1 style={{color: "Blue"}}>Proizvodi</h1></Row>
                
                <Row>
                    {this.renderSearchForm()}
                </Row>
            <br/>
            <Row>

                
                {window.localStorage['role']=='ROLE_ADMIN'?
                <Col>
                <Button onClick={() => this.goToAdd() }>Dodajte proizvod</Button> 
                </Col> : null}
                 
            
                <Col style={{display:'flex', justifyContent:'right'}}>
                <Button disabled={this.state.pageNo===0} 
                  onClick={()=>this.getProizvodi(this.state.pageNo-1)}
                  className="mr-3">Prethodna</Button>
                <Button disabled={this.state.pageNo==this.state.totalPages-1} 
                onClick={()=>this.getProizvodi(this.state.pageNo+1)}>Sledeca</Button>
                </Col>
            </Row>             
                        <Row><Col>
                        <Table style={{marginTop: 5, backgroundColor: 'whitesmoke'}}>
    
                            <thead>
                                <tr>
                                    <th>Naziv</th>
                                    <th>Cena</th>
                                    <th>Stanje</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderProizvodi(0)}
                            </tbody>                 
                            </Table>
                            </Col></Row>
            </Col>
            );
        }
    }
    
    export default withNavigation(withParams(Proizvod));