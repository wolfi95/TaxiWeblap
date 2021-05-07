import React from 'react';
import './AboutPage.scss';
import { Container } from '@material-ui/core'

export default function AboutPage() {
    return (
        <Container maxWidth="md" className="about-wrapper">
            <h1>About us</h1>
            <p>Maecenas sed risus tempus, efficitur lorem et, eleifend est. Nunc vel nunc vestibulum, imperdiet orci sit amet, pellentesque arcu. Curabitur feugiat orci blandit purus venenatis, vitae lacinia nisi gravida. Vivamus tristique velit eu elementum imperdiet. Vivamus sed magna id urna placerat imperdiet. Mauris eleifend nulla sed cursus varius. Praesent in laoreet libero. Donec id congue metus. Praesent cursus magna ac tempor lacinia. Donec venenatis leo in diam ultrices laoreet.</p>        
            <p>Mauris sagittis finibus orci, consectetur blandit nisi malesuada et. Praesent dapibus purus nibh, id vulputate diam interdum vel. Sed consectetur posuere scelerisque. Etiam condimentum ligula id sagittis lobortis. Nullam interdum eros elit, a interdum nibh consequat sit amet. Phasellus suscipit ex lacus. Proin venenatis a purus eget interdum. Duis ac accumsan sapien. Morbi viverra nisl sed elit accumsan tincidunt vel at turpis. Aenean in finibus nisi. Vivamus risus dolor, semper et iaculis sed, iaculis id turpis. Vestibulum accumsan feugiat convallis. Nullam bibendum ipsum at orci iaculis cursus.</p>
            <div className="picture-section">
                <img src={require("../../resources/images/about_us_1.png").default} />
                <p>Vestibulum sit amet urna leo. Nullam ornare elit id augue eleifend, ac malesuada ante rhoncus. Donec sit amet tortor suscipit, viverra ipsum ac, bibendum tortor. Phasellus tristique metus a tortor accumsan mollis. Phasellus ac massa ante. Duis sagittis consectetur odio, id aliquet lacus molestie interdum. Cras sodales, ligula ac auctor facilisis, ex nibh cursus quam, id consectetur ipsum quam accumsan tellus. Praesent semper velit ut nunc dictum eleifend. Proin lobortis lacus molestie metus pellentesque cursus.</p>
            </div>
            <p>In felis ipsum, maximus nec molestie convallis, pharetra imperdiet diam. Aenean finibus dui vitae eros feugiat viverra. Etiam vel tellus ligula. Pellentesque sit amet egestas purus, a sollicitudin libero. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas consectetur, ligula nec congue congue, nibh quam bibendum enim, id tristique libero tellus vel neque. Vestibulum ipsum nisi, aliquam eget euismod ut, vehicula non mi. Pellentesque faucibus lacus at facilisis porttitor. Nulla tincidunt accumsan eros eu tincidunt. Etiam viverra lacus eu libero egestas porttitor.</p>
            <p>In ultrices quam in condimentum tempor. Morbi tempus mattis sem sed pharetra. Donec volutpat enim in neque aliquet tristique. Quisque eget maximus diam, id finibus dolor. Nunc blandit nibh metus, molestie porta felis tempus ut. Donec laoreet ac orci nec tincidunt. Pellentesque mattis velit massa, quis tristique nisl accumsan mollis. Suspendisse potenti. Aliquam erat volutpat.</p>
        </Container>
    )
}