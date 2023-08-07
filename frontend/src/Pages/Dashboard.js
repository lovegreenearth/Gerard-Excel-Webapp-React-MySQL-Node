import React, { useEffect, useState } from 'react';
import '../Styles/dashboard.css';
import Header from '../Components/header/header';
import { Card, Row, Col, Input, Table, List } from 'antd';
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
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Disc',
    dataIndex: 'discount',
    key: 'discount',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'finalPrice',
    render: (item) => {
      <p>{item}%</p>
    }
  },
  {
    title: 'Weight',
    dataIndex: 'weight',
    key: 'weight',
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
            <div className='data-panel gap-4'>
              <div className='left-panel'>
                <Card>
                  <div>
                    <label>Search</label>
                    <Input placeholder="Search..." value={search} onChange={(e) => handleSearch(e)} />
                  </div>
                  <Row className='mt-4' gutter={[16, 16]}>
                    <Col span={12}>
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
                    <Col span={12}>
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
                </Card>
              </div>
              <div className='right-panel'>
                <Card>
                  <Table columns={columns} dataSource={products} />
                </Card>
              </div>
            </div>
          </main>
        </Card>
      </div>
    </div>
  );
}

export default HomePage;