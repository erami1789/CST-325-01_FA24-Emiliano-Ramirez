/*
 * An "object" representing a 3d vector to make operations simple and concise.
 *
 * Similar to how we work with plain numbers, we will work with vectors as
 * an entity unto itself.  Note the syntax below: var Vector3 = function...
 * This is different than you might be used to in most programming languages.
 * Here, the function is meant to be instantiated rather than called and the
 * instantiation process IS similar to other object oriented languages => new Vector3()
 */
// defualt 
var Vector3 = function(x=0, y=0, z=0) {
  this.x = x; this.y = y; this.z = z; 

  // Sanity check to prevent accidentally using this as a normal function call
  if (!(this instanceof Vector3)) {
    console.error("Vector3 constructor must be called with the 'new' operator");
  }
}

Vector3.prototype = {

  //----------------------------------------------------------------------------- 
  set: function(x, y, z) {
    this.x=x;
    this.y=y //setters
    this.z=z
    // todo set 'this' object's values to those from x, y, and z
    return this;
  },

  //----------------------------------------------------------------------------- 
  clone: function() {
    return new Vector3(this.x, this.y, this.z);
  },

  //----------------------------------------------------------------------------- 
  copy: function(other) {
    this.x=other.x;
    this.y=other.y;
    this.z=other.z;
    return this;
  },

  //----------------------------------------------------------------------------- 
  negate: function() {
    this.x =-this.x;
    this.y=-this.y;
    this.z=-this.z;
    // multiply 'this' vector by -1
    // This SHOULD change the values of this.x, this.y, and this.z
    return this;
  },

  //----------------------------------------------------------------------------- 
  add: function(v) {
    this.x= this.x + v.x;
    this.y= this.y + v.y;
    this.z= this.z + v.z;
    // todo - add v to 'this' vector
    // This SHOULD change the values of this.x, this.y, and this.z
    return this;
  },

  //----------------------------------------------------------------------------- 
  subtract: function(v) {
    this.x= this.x - v.x;
    this.y= this.y - v.y;
    this.z= this.z - v.z;
    // todo - subtract v from 'this' vector
    // This SHOULD change the values of this.x, this.y, and this.z
    return this;
  },

  //----------------------------------------------------------------------------- 
  multiplyScalar: function(scalar) {
    this.x= this.x * scalar;
    this.y= this.y * scalar;
    this.z= this.z * scalar;
    // multiply 'this' vector by "scalar"
    // This SHOULD change the values of this.x, this.y, and this.z
    return this;
  },

  //----------------------------------------------------------------------------- 
  length: function() {
    // todo - return the magnitude (A.K.A. length) of 'this' vector
    // This should NOT change the values of this.x, this.y, and this.z
    return Math.sqrt(this.x **2 +this.y **2 +this.z **2);
  },

  //----------------------------------------------------------------------------- 
  lengthSqr: function() {
    return Math.sqrt(this.x **2 +this.y **2 +this.z **2)**2;
    // todo - return the squared magnitude of this vector ||v||^2
    // This should NOT change the values of this.x, this.y, and this.z

    // There are many occasions where knowing the exact length is unnecessary 
    // and the square can be substituted instead (for performance reasons).  
    // This function should NOT have to take the square root of anything.
  },

  //----------------------------------------------------------------------------- 
  normalize: function() {
    var magnitude = Math.sqrt(this.x **2 +this.y **2 +this.z **2);
    this.x= this.x/magnitude;
    this.y= this.y/magnitude;
    this.z = this.z/magnitude;

    // todo - Change the components of this vector so that its magnitude will equal 1.
    // This SHOULD change the values of this.x, this.y, and this.z
    return this;
  },

  //----------------------------------------------------------------------------- 
  dot: function(other) {
    var dot = (this.x *other.x) +(this.y *other.y) +(this.z *other.z)
    // todo - return the dot product betweent this vector and "other"
    // This should NOT change the values of this.x, this.y, and this.z
    return dot;
  },


  //============================================================================= 
  // The functions below must be completed in order to receive an "A"

  //----------------------------------------------------------------------------- 
  fromTo: function(fromPoint, toPoint) {
    if (!(fromPoint instanceof Vector3) || !(toPoint instanceof Vector3)) {
      console.error("fromTo requires to vectors: 'from' and 'to'");
    }
    // todo - return the vector that goes from "fromPoint" to "toPoint"
    //        NOTE - "fromPoint" and "toPoint" should not be altered
  },

  //----------------------------------------------------------------------------- 
  rescale: function(newScale) {
    // todo - Change this vector's length to be newScale
    return this;
  },

  //----------------------------------------------------------------------------- 
  angle: function(v1, v2) {
    // todo - calculate the angle in degrees between vectors v1 and v2. Do NOT
    //        change any values on the vectors themselves
    return 0;
  },

  //----------------------------------------------------------------------------- 
  project: function(vectorToProject, otherVector) {
    // todo - return a vector that points in the same direction as "otherVector"
    //        but whose length is the projection of "vectorToProject" onto "otherVector"
    //        NOTE - "vectorToProject" and "otherVector" should NOT be altered (i.e. use clone)
    //        See "Vector Projection Slides" under "Extras" for more info.

  }
};

 
