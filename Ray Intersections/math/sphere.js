/*
 * An object type representing an implicit sphere.
 *
 * @param center A Vector3 object representing the position of the center of the sphere
 * @param radius A Number representing the radius of the sphere.
 * 
 * Example usage:
 * var mySphere = new Sphere(new Vector3(1, 2, 3), 4.23);
 * var myRay = new Ray(new Vector3(0, 1, -10), new Vector3(0, 1, 0));
 * var result = mySphere.raycast(myRay);
 * 
 * if (result.hit) {
 *   console.log("Got a valid intersection!");
 * }
 */

var Sphere = function(center, radius) {
  // Sanity checks (your modification should be below this where indicated)
  if (!(this instanceof Sphere)) {
    console.error("Sphere constructor must be called with the new operator");
  }

  this.center = center;
  this.radius = radius;
  if(center === undefined)
  {
    this.center = new Vector3(0, 0, 0);
  }
  if ( radius === undefined)
  {
    this.radius =1;
  }

  // Sanity checks (your modification should be above this)
  if (!(this.center instanceof Vector3)) {
    console.error("The sphere center must be a Vector3");
  }

  if ((typeof(this.radius) != 'number')) {
    console.error("The radius must be a Number");
  }
};

Sphere.prototype = {
  
  //----------------------------------------------------------------------------- 
  raycast: function(r1) {




    // todo - determine whether the ray intersects has a VALID intersection with this
	//        sphere and if so, where. A valid intersection is on the is in front of
	//        the ray and whose origin is NOT inside the sphere

    // Recommended steps
    // ------------------
    // the vectors needed to solve for the coefficients in the quadratic equation
    var a = (r1.direction.dot(r1.direction));

    var b = (2*(r1.direction.dot(r1.origin.clone().subtract(this.center))));

    var c = ((r1.origin.clone().subtract(this.center)).dot(r1.origin.clone().subtract(this.center))) - this.radius*this.radius;

    var discriminant = ((b*b) - (4 * a * c));

 if( discriminant < 0 )
 {
  return {
    hit: false,
    point: null,
    normal: null,
    distance: null,

  };  
 }
 var discriminantsqr = Math.sqrt(discriminant);
 
 var h1 = (-b +discriminantsqr)/(2*a)

var h2 = (-b - discriminantsqr)/(2*a)

if ( h1 < 0 && h2 < 0 )
{
  return {
    hit : false,
    point: null,
    normal : null,
    distance: null,
}
};
var h = Math.min(h1,h2)
 if (h < 0) h = Math.max(h1, h2);

var hitPoint = r1.origin.add(r1.direction.multiplyScalar(h));
var normal = hitPoint.subtract(this.center).normalize();

    var result = {
      hit: true,      // should be of type Boolean
      point: hitPoint,    // should be of type Vector3
      normal: normal,   // should be of type Vector3
      distance: h, // should be of type Number (scalar)
    };

    return result;
  }
}

// EOF 00100001-10