import React, { useState } from "react";
import { Form, Input, Select, Checkbox, Button, Layout, Menu, message } from "antd";

const { Header, Content } = Layout;

const MainAnalis = () => {
  const [formValues, setFormValues] = useState({
    area_total: 0,
    floor_number: 0,
    total_floors: 0,
    building_type: "",
    year_built: 0,
    ceiling_height: 0,
    has_balcony: false,
    condition: "",
    address: "",
    heating: "",
    water_supply: false,
    sewerage: false,
    electricity: false,
    gas: false,
    internet: false,
  });

  const handleFormChange = (changedValues) => {
    setFormValues((prevValues) => ({ ...prevValues, ...changedValues }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/estate/create-estate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const data = await response.json();
        message.success("Данные успешно отправлены!");
        console.log("Response:", data);
      } else {
        const errorData = await response.json();
        message.error(`Ошибка: ${errorData.detail || "Не удалось отправить данные"}`);
        console.error("Error response:", errorData);
      }
    } catch (error) {
      message.error("Произошла ошибка при отправке данных");
      console.error("Fetch error:", error);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header with navigation */}
      <Header style={{ backgroundColor: "#ffffff", display: "flex", alignItems: "center" }}>
        <div style={{ fontWeight: "bold", fontSize: "18px", marginRight: "auto" }}>Real Estate</div>
        <Menu mode="horizontal">
          <Menu.Item key="main">
            <a href="#main">Главная</a>
          </Menu.Item>
          <Menu.Item key="spec">
            <a href="#spec">Специалисты</a>
          </Menu.Item>
          <Menu.Item key="news">
            <a href="#news">Новости</a>
          </Menu.Item>
          <Menu.Item key="analis">
            <a href="#analis">Аналитика</a>
          </Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: "24px", display: "flex", justifyContent: "center" }}>
        <Form
          layout="vertical"
          onValuesChange={handleFormChange}
          style={{
            maxWidth: "800px",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            background: "#fff",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "16px" }}>
            Узнайте рыночную цену недвижимости
          </h2>

          <Form.Item label="Адрес" name="address" rules={[{ required: true, message: "Введите адрес" }]}>
            <Input placeholder="Адрес и номер дома" />
          </Form.Item>

          <Form.Item label="Общая площадь (м²)" name="area_total">
            <Input type="number" placeholder="Введите площадь" />
          </Form.Item>

          <Form.Item label="Этаж" name="floor_number">
            <Input type="number" placeholder="Введите этаж" />
          </Form.Item>

          <Form.Item label="Количество этажей" name="total_floors">
            <Input type="number" placeholder="Введите общее количество этажей" />
          </Form.Item>

          <Form.Item label="Тип здания" name="building_type">
            <Select placeholder="Выберите тип здания">
              <Select.Option value="brick">Кирпичное</Select.Option>
              <Select.Option value="panel">Панельное</Select.Option>
              <Select.Option value="monolith">Монолитное</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Год постройки" name="year_built">
            <Input type="number" placeholder="Введите год постройки" />
          </Form.Item>

          <Form.Item label="Высота потолков (м)" name="ceiling_height">
            <Input type="number" step="0.1" placeholder="Введите высоту потолков" />
          </Form.Item>

          <Form.Item label="Балкон">
            <Checkbox
              checked={formValues.has_balcony}
              onChange={(e) => handleFormChange({ has_balcony: e.target.checked })}
            >
              Есть
            </Checkbox>
          </Form.Item>

          <Form.Item label="Состояние" name="condition">
            <Select placeholder="Выберите состояние">
              <Select.Option value="excellent">Отличное</Select.Option>
              <Select.Option value="good">Хорошее</Select.Option>
              <Select.Option value="needs_repair">Требует ремонта</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Отопление" name="heating">
            <Select placeholder="Выберите тип отопления">
              <Select.Option value="central">Центральное</Select.Option>
              <Select.Option value="autonomous">Автономное</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Инженерные системы">
            <Checkbox
              checked={formValues.water_supply}
              onChange={(e) => handleFormChange({ water_supply: e.target.checked })}
            >
              Водоснабжение
            </Checkbox>
            <Checkbox
              checked={formValues.sewerage}
              onChange={(e) => handleFormChange({ sewerage: e.target.checked })}
            >
              Канализация
            </Checkbox>
            <Checkbox
              checked={formValues.electricity}
              onChange={(e) => handleFormChange({ electricity: e.target.checked })}
            >
              Электричество
            </Checkbox>
            <Checkbox
              checked={formValues.gas}
              onChange={(e) => handleFormChange({ gas: e.target.checked })}
            >
              Газ
            </Checkbox>
            <Checkbox
              checked={formValues.internet}
              onChange={(e) => handleFormChange({ internet: e.target.checked })}
            >
              Интернет
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSubmit} block>
              Узнать цену
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default MainAnalis;
