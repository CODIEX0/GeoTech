import React from "react";


function header()
{
    window.addEventListener("scroll", function(){
        var nav = document.querySelector(".navbar");
        nav.classList.toggle("sticky", window.scrollY > 150);
    });

    return(
        <div>
            <section id="hero-section">
                
                <div  className="hero-content ">
                <h1 className="main-header"> </h1>
                    GeoTech                        
                <p className="text">Make a change | Make a green change</p>
                </div>
            </section>
            <nav className="navbar">
                <div className="navbar-brand">Geo Tech</div>

                <div className="navlist"><ul>
                   <a href="#home"><li className="navitem">Home</li> </a>       
                   <a href="#about"><li className="navitem">About</li></a>
                   <a href="#contact"><li className="navitem">Contact</li></a>        
                </ul>
                
                </div>
        
            </nav>

        </div>
    );
    
}

export default header;

