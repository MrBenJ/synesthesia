const boxes = Array.from(document.querySelectorAll('.box'));

const onBoxClick = ({ currentTarget }) => {
  currentTarget.classList.toggle('expand');

}
boxes.forEach(box => {
  box.addEventListener('click', onBoxClick);
})
