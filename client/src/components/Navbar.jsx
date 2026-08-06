function Navbar(props){

  return(
    <nav>

      <h2>{props.title}</h2>


      <ul>

        <li onClick={() => props.setPage("home")}>
          Home
        </li>


        <li onClick={() => props.setPage("features")}>
          Features
        </li>


        <li onClick={() => props.setPage("about")}>
          About
        </li>


        <li>
          <a href="srivastavaanmol778@gmail.com">
            Contact
          </a>
        </li>


      </ul>

    </nav>
  )

}


export default Navbar;