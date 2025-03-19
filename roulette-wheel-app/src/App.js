import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import './App.css';

// Styled components for our roulette wheel
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const WheelContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 30px 0;
`;

const Wheel = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  transition: transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  transform: rotate(0deg);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
`;

const Segment = styled.div`
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: bottom right;
  left: 0;
  top: 0;
  background: ${props => props.color};
  transform: rotate(${props => props.rotate}deg) skewY(${props => props.skew}deg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
`;

const SegmentContent = styled.div`
  position: absolute;
  left: 100%;
  transform: translate(-50%, -50%) rotate(${props => props.rotate}deg);
  transform-origin: center;
  text-align: center;
  width: 80px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Pointer = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 30px solid #f00;
  z-index: 10;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ItemsList = styled.div`
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const ResultLink = styled.a`
  color: #2196F3;
  text-decoration: none;
  font-weight: bold;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Color palette for wheel segments
const colors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
  '#FF9F40', '#8AC24A', '#FF5252', '#00BCD4', '#673AB7',
  '#FFC107', '#795548', '#607D8B', '#E91E63', '#3F51B5'
];

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const wheelRef = useRef(null);
  const [rotation, setRotation] = useState(0);

  // Add a new item to the wheel
  const addItem = () => {
    if (name.trim() && link.trim()) {
      // Basic URL validation
      let formattedLink = link;
      if (!formattedLink.startsWith('http://') && !formattedLink.startsWith('https://')) {
        formattedLink = 'https://' + formattedLink;
      }
      
      setItems([...items, { name: name.trim(), link: formattedLink }]);
      setName('');
      setLink('');
    }
  };

  // Remove an item from the wheel
  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Spin the wheel
  const spinWheel = () => {
    if (items.length > 1 && !isSpinning) {
      setIsSpinning(true);
      setResult(null);
      
      // Calculate a random rotation (between 5 and 10 full rotations)
      const spinAngle = 1800 + Math.floor(Math.random() * 1800);
      const newRotation = rotation + spinAngle;
      
      setRotation(newRotation);
      
      // After the spinning animation completes, determine the result
      setTimeout(() => {
        const segmentAngle = 360 / items.length;
        // Calculate which segment is at the top (pointer) position
        const normalizedRotation = newRotation % 360;
        const winningIndex = Math.floor((360 - normalizedRotation) / segmentAngle);
        const actualIndex = winningIndex % items.length;
        
        setResult(items[actualIndex]);
        setIsSpinning(false);
      }, 5000); // This should match the CSS transition time
    }
  };

  // Update wheel rotation
  useEffect(() => {
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }, [rotation]);

  return (
    <Container>
      <Title>Roulette Wheel</Title>
      
      <Form>
        <InputGroup>
          <Input 
            type="text" 
            placeholder="Item name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            type="text" 
            placeholder="Link (URL)" 
            value={link} 
            onChange={(e) => setLink(e.target.value)}
          />
          <Button onClick={addItem}>Add</Button>
        </InputGroup>
        
        <Button 
          onClick={spinWheel} 
          disabled={items.length < 2 || isSpinning}
        >
          {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
        </Button>
      </Form>
      
      <WheelContainer>
        <Wheel ref={wheelRef}>
          {items.map((item, index) => {
            const segmentAngle = 360 / items.length;
            const rotate = index * segmentAngle;
            const skew = 90 - segmentAngle;
            
            return (
              <Segment 
                key={index} 
                color={colors[index % colors.length]} 
                rotate={rotate} 
                skew={skew}
              >
                <SegmentContent rotate={segmentAngle / 2}>
                  {item.name}
                </SegmentContent>
              </Segment>
            );
          })}
        </Wheel>
        <Pointer />
      </WheelContainer>
      
      {result && (
        <ResultContainer>
          <p>Result: <strong>{result.name}</strong></p>
          <ResultLink href={result.link} target="_blank" rel="noopener noreferrer">
            Visit {result.link}
          </ResultLink>
        </ResultContainer>
      )}
      
      <ItemsList>
        <h3>Added Items:</h3>
        {items.map((item, index) => (
          <Item key={index}>
            <span>{item.name} - <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a></span>
            <DeleteButton onClick={() => removeItem(index)}>Delete</DeleteButton>
          </Item>
        ))}
      </ItemsList>
    </Container>
  );
}

export default App;
