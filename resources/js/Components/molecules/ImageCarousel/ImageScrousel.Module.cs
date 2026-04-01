.sliderBackground::before {
    position: absolute;
    content: '';
    background: var(--image_slider_src);
    /* background-size: cover; */
    filter: blur(2px) grayscale(0) brightness(0.9);
    width: 100%;
    height: 100%;
    z-index: -1;
    top: 0;
}

.marquee_vertical.marquee_vertical {
    --width: unset;
}
