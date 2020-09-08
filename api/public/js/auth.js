const svg = document.getElementById('ghost')
const right_eye = document.getElementById('right-eye')
const right_pupil = document.getElementById('right-pupil')
const left_eye = document.getElementById('left-eye')
const left_pupil = document.getElementById('left-pupil')
const eyes = { right_eye, left_eye, right_pupil, left_pupil }


const set_pupil = (eye, pupil, degree) => {
    const angle = degree * Math.PI/180;
    const r = parseInt(eye.getAttributeNS(null, 'r'))
    const cx = parseInt(eye.getAttributeNS(null, 'cx'));
    const cy = parseInt(eye.getAttributeNS(null, 'cy'));
    const x = cx + r/2 * Math.cos(angle);
    const y = cy + r/2 * Math.sin(angle);
    pupil.setAttributeNS(null, 'cx', x);
    pupil.setAttributeNS(null, 'cy', y);
}

const set_pupils = (eyes, degree) => {
    set_pupil(eyes.right_eye, eyes.right_pupil, degree)
    set_pupil(eyes.left_eye, eyes.left_pupil, degree)
}

const spin_eyes = () => {
    const eyes = { right_eye, left_eye, right_pupil, left_pupil }
    const delay = 100;
    let degree = 0;
    const frame = () => {
        set_pupils(eyes, degree);
        degree = (degree === 360) ? 0 : degree+5;
        setTimeout(frame, delay)
    }
    frame();
}


let current_degree = (Math.random() > 0.5) ? 0 : 180
set_pupils(eyes, current_degree);


const animate_eyes = (target) => {
    const frame = () => {
        set_pupils(eyes, current_degree);
        if(current_degree > target) current_degree -= 3;
        else if (current_degree < target) current_degree += 3;
        else return;
        setTimeout(frame, 1)
    }
    frame();
}