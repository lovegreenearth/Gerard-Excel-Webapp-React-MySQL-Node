import React, { useEffect, useState } from 'react';
import '../Styles/dashboard.css';
import Header from '../Components/header/header';
import { Card, Row, Col, Input, Table, List, Button } from 'antd';
import { ApiService } from '../Service/api';

const { TextArea } = Input;

const columns = [
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Price £',
    dataIndex: 'price',
    key: 'price',
    render: text => <>£ {text}</>
  },
  {
    title: 'Disc',
    dataIndex: 'discount',
    key: 'discount',
    render: text => <p>{text * 100} %</p>
  },
  {
    title: 'Price £',
    dataIndex: 'finalPrice',
    key: 'finalPrice',
    render: (_, item) => (
      <>£ {(item.price * (1 - item.discount)).toFixed(2)}</>
    )
  },
  {
    title: 'Weight',
    dataIndex: 'weight',
    key: 'weight',
    render: text => <p>{text}</p>
  },
];

function HomePage() {
  const [maingroups, setMaingroups] = useState([]);
  const [subgroupList, setSubgroupList] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [products, setProducts] = useState([]);
  const [note, setNote] = useState("");
  const [selectedMaingroup, setSelectedMaingroup] = useState("");
  const [selectedSubgroup, setSelectedSubgroup] = useState("");
  const [search, setSearch] = useState("");
  const [showSearchFlag, setShowSearchFlag] = useState(false);

  const handleMaingroupChange = (value) => {
    setSelectedSubgroup("");
    setNote("");
    setSelectedMaingroup(value);
    const selectedSubgroups = subgroupList.filter(item => item.mainGroup === value);
    setSubgroups(selectedSubgroups);
    getProducts(search, value, "");
  }

  const handleSubgroupChange = (value) => {
    setSelectedSubgroup(value);
    const subgroup = subgroupList.filter(item => item.id === value)[0];
    if (subgroup) {
      setNote(subgroup.notes);
    }
    getProducts(search, selectedMaingroup, value);
  }

  useEffect(() => {
    getSubgroups();
    getMaingroup();
    getProducts(search, selectedMaingroup, selectedSubgroup);
  }, [])

  const getMaingroup = () => {
    ApiService.getMaingroups().then(res => {
      if (res.status === 200) {
        if (res.data.data) {
          setMaingroups(res.data.data);
          const selectedSubgroups = subgroupList.filter(item => item.mainGroup === res.data.data[0].id);
          setSubgroups(selectedSubgroups);
        }
      }
    })
  }

  const getSubgroups = () => {
    ApiService.getSubgroups().then(res => {
      if (res.status === 200) {
        setSubgroupList(res.data.data);
        setSubgroups(res.data.data);
      }
    })
  }

  const getProducts = (search, main, sub) => {
    if (search || showSearchFlag) {
      main = "";
      sub = "";
    }
    ApiService.getProducts(search, main, sub).then(res => {
      if (res.status === 200) {
        if (res.data.data) {
          const products = res.data.data.map((item, index) => {
            return {
              key: index,
              code: item.code,
              description: item.description,
              price: item.price,
              discount: item.maxDiscount,
              finalPrice: item.price,
              weight: item.weight
            };
          });
          setProducts(products);
        }
      }
    })
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);
    getProducts(e.target.value, selectedMaingroup, selectedSubgroup);
  }

  return (
    <div className="App">
      <div className='content'>
        <Card className='main-card'>
          <Header />
          <main className='mt-4'>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={10} lg={8}>
                <div>
                  <Card>
                    {showSearchFlag ?
                      <div>
                        <div>
                          <label>Search For Code or Description: </label>
                          <Input placeholder="Search..." value={search} onChange={(e) => handleSearch(e)} />
                          <div className='mt-4'></div>
                          <Row>
                            <Col span={24}>
                              <div className='textarea-title'>
                                <p>
                                  {search ?
                                    products.length + " Matches Found" :
                                    "Search Criteria"
                                  }
                                </p>
                              </div>
                              <TextArea
                                value={search ?
                                  products.length + " matches were found for " + search :
                                  "Please enter your search criteria in the Search For box. For best results please keep the search criteria short and avoid using plurals."
                                }
                                placeholder="Note"
                                className='border-top-radius-0'
                                autoSize={{
                                  minRows: 5,
                                  maxRows: 8,
                                }}
                              />
                            </Col>
                          </Row>
                          <Button block
                            onClick={() => {
                              setShowSearchFlag(!showSearchFlag);
                              setSearch("");
                            }}
                            className='mt-4'>
                            PRESS TO RETURN TO PRICE LIST
                          </Button>
                        </div>
                      </div> :
                      <div>
                        <Button block
                          onClick={() => {
                            setShowSearchFlag(!showSearchFlag);
                            getProducts("", "", "");
                          }}>
                          PRESS TO SEARCH PRICE LIST
                        </Button>
                        <Row className='mt-4' type="flex" gutter={[16, 16]}>
                          <Col xs={24} sm={24} md={24} lg={12}>
                            <label>Main Group</label>
                            <List
                              bordered
                              dataSource={maingroups}
                              size='small'
                              className='list'
                              renderItem={(item) => (
                                <List.Item onClick={() => handleMaingroupChange(item.id)}
                                  className='cursor-pointer'>
                                  {item.name}
                                </List.Item>
                              )}
                            />
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={12}>
                            <label>Sub Group</label>
                            <List
                              bordered
                              dataSource={subgroups}
                              size='small'
                              className='list'
                              renderItem={(item) => (
                                <List.Item onClick={() => handleSubgroupChange(item.id)}
                                  className='cursor-pointer'>
                                  {item.name}
                                </List.Item>
                              )}
                            />
                          </Col>
                        </Row>
                        <div className='mt-4'></div>
                        <Row>
                          <Col span={24}>
                            <TextArea
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              placeholder="Note"
                              autoSize={{
                                minRows: 5,
                                maxRows: 8,
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    }
                  </Card>
                </div>
              </Col>
              <Col xs={24} sm={24} md={14} lg={16}>
                <Card>
                  <Table columns={columns} dataSource={products} className='product-table' />
                </Card>
              </Col>
            </Row>
          </main>
        </Card>
      </div>
    </div>
  );
}

export default HomePage;