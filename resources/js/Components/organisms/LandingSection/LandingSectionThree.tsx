import classes from "./LandingSectionThree.module.css"
import { Title, Container, useMantineTheme, BackgroundImage } from "@mantine/core"
import { Card, Image, Text, Badge, Group } from "@mantine/core"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { ArticlesSlider } from "./ArticlesSlider"

function LandingSectionThree() {
  return (
    <Container size="lg" py="xl">
      {/* <Slider {...settings}>{features}</Slider> */}
      <ArticlesSlider/>
    </Container>
  )
}

export default LandingSectionThree
