import React, { useState } from "react";
import ReactDOM from "react-dom";

import { ChevronRight, ChevronLeft } from "react-feather";
import { animated, useTransition, useSprings } from "react-spring";

import styled, { ThemeProvider } from "styled-components";

import { Box, Container, Heading, Typography, Flex, theme } from "../../ui";

import "../../ui/molecules/global-styles/global.css";

import { slides } from "../slides";

const blue = theme.colors.brand;
const text100 = theme.colors.text100;
const text500 = theme.colors.text500;

const sliderHeight = 350;

const Slide = styled(animated(Flex))``;
Slide.defaultProps = {
  position: "absolute",
  justifyContent: "flex-end",
  height: sliderHeight,
  width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  willChange: "opacity"
};

const SlideText = styled(animated(Flex))``;
SlideText.defaultProps = {
  flexDirection: "column",
  width: [1, null, null, 1 / 2],
  alignSelf: "flex-end",
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  p: 2,
  m: [0, null, null, 2]
};

const ControlsWrap = styled(Flex)``;
ControlsWrap.defaultProps = {
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center"
};

const Control = styled(Flex)`
  cursor: pointer;
`;
Control.defaultProps = {
  background: "#c6c6c6",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  size: [24, null, 36]
};

const Bullet = styled(animated(Control))``;
Bullet.defaultProps = {
  mx: [1, null, 2],
  color: "text500"
};

const Arrow = styled(Control)``;
Arrow.defaultProps = {
  mx: [1, null, 6]
};

function App() {
  const [[index, dir], setIndex] = useState([0, 0]);

  const slideLeft = () =>
    setIndex([(index - 1 + slides.length) % slides.length, -1]);
  const slideRight = () => setIndex([(index + 1) % slides.length, 1]);

  const transitions = useTransition(slides[index], (item) => item.url, {
    from: {
      opacity: 0,
      transform: `translate3d(${dir === 1 ? 100 : -100}%,0,0) scale(0.5)`
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0%,0,0) scale(1)"
    },
    leave: {
      opacity: 0,
      transform: `translate3d(${dir === 1 ? -100 : 100}%,0,0) scale(0.5)`
    }
  });

  const bulletSprings = useSprings(
    slides.length,
    slides.map((item, i) => ({
      border: "2px solid",
      borderColor: index === i ? blue : text100,
      background: index === i ? "rgba(0,0,0,0)" : "#c6c6c6",
      color: index === i ? blue : text500,
      from: {
        border: "2px solid",
        borderColor: text100,
        color: text500
      }
    }))
  );

  return (
    <ThemeProvider theme={theme}>
      <Box bg="bg100" minHeight="100vh" py={1}>
        <Container>
          <Heading textAlign="center">
            React Spring Example - useTransition
          </Heading>
          <Box height={sliderHeight + 48}>
            <Box position="relative">
              {transitions.map(({ item, props, key }) => (
                <Box key={key}>
                  <Slide
                    style={props}
                    background={`url(${item.url}?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`}
                  >
                    <SlideText>
                      <Typography fontWeight={2} fontSize={4}>
                        {item.title}
                      </Typography>
                      {item.text}
                    </SlideText>
                  </Slide>
                </Box>
              ))}
              <ControlsWrap pt={sliderHeight + 8}>
                <Arrow onClick={() => slideLeft()}>
                  <ChevronLeft />
                </Arrow>
                {bulletSprings.map((props, i) => (
                  <Flex
                    key={i}
                    onClick={() =>
                      setIndex((prevState) => [i, i > prevState[0] ? 1 : -1])
                    }
                  >
                    <Bullet style={props}>{i + 1}</Bullet>
                  </Flex>
                ))}
                <Arrow onClick={() => slideRight()}>
                  <ChevronRight />
                </Arrow>
              </ControlsWrap>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
