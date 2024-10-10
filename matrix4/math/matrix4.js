/*
 * An object representing a 4x4 matrix
 */

var Matrix4 = function(x, y, z) {
  this.elements = new Float32Array(16);

  if (!(this instanceof Matrix4)) {
    console.error("Matrix4 constructor must be called with the new operator");
  }

  return this.makeIdentity();
}

//=============================================================================  
Matrix4.prototype = {

  // -------------------------------------------------------------------------
  clone: function() {
    var newMatrix = new Matrix4();
    for (var i = 0; i < 16; ++i) {
      newMatrix.elements[i] = this.elements[i];
    }
    return newMatrix;
  },

  // -------------------------------------------------------------------------
  copy: function(m) {
    for (var i = 0; i < 16; ++i) {
      this.elements[i] = m.elements[i];
    }

    return this;
  },

  // -------------------------------------------------------------------------
  getElement: function(row, col) {
    return this.elements[row * 4 + col];
  },

  // -------------------------------------------------------------------------
  set: function(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
    var e = this.elements;

    e[0] = n11; e[1] = n12; e[2] = n13; e[3] = n14;
    e[4] = n21; e[5] = n22; e[6] = n23; e[7] = n24;
    e[8] = n31; e[9] = n32; e[10] = n33; e[11] = n34;
    e[12] = n41; e[13] = n42; e[14] = n43; e[15] = n44;

    return this;
  },

  // -------------------------------------------------------------------------
  makeIdentity: function() {
    var e = this.elements;
    e[0] = 1; e[1] = 0; e[2] = 0; e[3] = 0;
    e[4] = 0; e[5] = 1; e[6] = 0; e[7] = 0;
    e[8] = 0; e[9] = 0; e[10] = 1; e[11] = 0;
    e[12] = 0; e[13] = 0; e[14] = 0; e[15] = 1;
    return this;
    },

  // -------------------------------------------------------------------------
  multiplyScalar: function(s) {
    for (var i = 0; i < 16; ++i) {
      this.elements[i] = this.elements[i] * s;
    }
  },

  // -------------------------------------------------------------------------
  multiplyVector: function(v) {
    // safety check
    if (!(v instanceof Vector4)) {
      console.error("Trying to multiply a 4x4 matrix with an invalid vector value");
    }

    var result = new Vector4();
    var x = v.x, y = v.y, z = v.z, w = v.w;

    // Perform matrix-vector multiplication
    result.x = this.elements[0] * x + this.elements[1] * y + this.elements[2] * z + this.elements[3] * w;
    result.y = this.elements[4] * x + this.elements[5] * y + this.elements[6] * z + this.elements[7] * w;
    result.z = this.elements[8] * x + this.elements[9] * y + this.elements[10] * z + this.elements[11] * w;
    result.w = this.elements[12] * x + this.elements[13] * y + this.elements[14] * z + this.elements[15] * w;

    
    // todo
    // set the result vector values to be the result of multiplying the
    // vector v by 'this' matrix
    return result;
  },

  // -------------------------------------------------------------------------
  multiply: function(rightSideMatrix) {
    // safety check
    if (!(rightSideMatrix instanceof Matrix4)) {
      console.error("Trying to multiply a 4x4 matrix with an invalid matrix value");
    }
    let result = new Matrix4();

    // Multiply 'this' matrix by 'rightSideMatrix'
    for (let i = 0; i < 4; i++) { // Rows of 'this' matrix
      for (let j = 0; j < 4; j++) { // Columns of 'rightSideMatrix'
        result.elements[i * 4 + j] = 
          this.elements[i * 4 + 0] * rightSideMatrix.elements[0 * 4 + j] +
          this.elements[i * 4 + 1] * rightSideMatrix.elements[1 * 4 + j] +
          this.elements[i * 4 + 2] * rightSideMatrix.elements[2 * 4 + j] +
          this.elements[i * 4 + 3] * rightSideMatrix.elements[3 * 4 + j];
      }
    }
    this.elements = result.elements;

    // Perform matrix-vector multiplication
    // todo - multiply 'this' * rightSideMatrix
    return this;
  },

  // -------------------------------------------------------------------------
  premultiply: function(leftSideMatrix) {
    // ignore this, the implementation will be distributed with the solution
    return this;
  },

  // -------------------------------------------------------------------------
  makeScale: function(x, y, z) {
    this.elements = [
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
  ];
    return this;
  },

  // -------------------------------------------------------------------------
  makeRotationX: function(degrees) {
    // todo - convert to radians
    var radians = degrees * Math.PI / 180;
    // var radians = ...

    // shortcut - use in place of this.elements
    var e = this.elements;

    // todo - set every element of this matrix to be a rotation around the x-axis

    e[0] = 1; e[1] = 0;           e[2] = 0;           e[3] = 0;
    e[4] = 0; e[5] = Math.cos(radians); e[6] = -Math.sin(radians); e[7] = 0;
    e[8] = 0; e[9] = Math.sin(radians); e[10] = Math.cos(radians); e[11] = 0;
    e[12] = 0; e[13] = 0;          e[14] = 0;          e[15] = 1;

    return this;
  },

  // -------------------------------------------------------------------------
  makeRotationY: function(degrees) {
    // todo - convert to radians
    var radians = degrees * Math.PI / 180;

    // shortcut - use in place of this.elements
    var e = this.elements;

    e[0] = Math.cos(radians);  e[1] = 0; e[2] = Math.sin(radians); e[3] = 0;
    e[4] = 0;                 e[5] = 1; e[6] = 0;                 e[7] = 0;
    e[8] = -Math.sin(radians); e[9] = 0; e[10] = Math.cos(radians); e[11] = 0;
    e[12] = 0;                e[13] = 0; e[14] = 0;                e[15] = 1;

    return this;
  },

  // -------------------------------------------------------------------------
  makeRotationZ: function(degrees) {
    // todo - convert to radians
    var radians = degrees * Math.PI / 180;

    // shortcut - use in place of this.elements
    var e = this.elements;
    e[0] = Math.cos(radians);  e[1] = -Math.sin(radians); e[2] = 0; e[3] = 0;
    e[4] = Math.sin(radians);  e[5] = Math.cos(radians);  e[6] = 0; e[7] = 0;
    e[8] = 0;                 e[9] = 0;                  e[10] = 1; e[11] = 0;
    e[12] = 0;                e[13] = 0;                 e[14] = 0; e[15] = 1;

    // todo - set every element of this matrix to be a rotation around the z-axis
    return this;
  },

  // -------------------------------------------------------------------------
  makeTranslation: function(arg1, arg2, arg3) {
    // todo - wipe out the existing matrix and make it a pure translation
    //      - If arg1 is a Vector3 or Vector4, use its components and ignore
    //        arg2 and arg3. O.W., treat arg1 as x, arg2 as y, and arg3 as z
    var x, y, z;

    if (arg1 instanceof Vector4) {
      x = arg1.x;
      y = arg1.y;
      z = arg1.z;
    } else if (arg1 instanceof Vector3) {
      x = arg1.x;
      y = arg1.y;
      z = arg1.z;
    } else {
      x = arg1;
      y = arg2;
      z = arg3;
    }
    this.elements = [
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z,
      0, 0, 0, 1
  ];
    return this;
  },

  // -------------------------------------------------------------------------
  makePerspective: function(fovy, aspect, near, far) {
    // todo - convert fovy to radians
    var fovyRads = fovy * Math.PI / 180;


    // todo -compute t (top) and r (right)
    var t = Math.tan(fovyRads / 2) * near;  
    var r = t * aspect; 
    // shortcut - use in place of this.elements
    var e = this.elements;

    // todo - set every element to the appropriate value
    e[0] = near / r; e[1] = 0;       e[2] = 0;                                e[3] = 0;
    e[4] = 0;        e[5] = near / t; e[6] = 0;                                e[7] = 0;
    e[8] = 0;        e[9] = 0;       e[10] = -(far + near) / (far - near);    e[11] = -(2 * far * near) / (far - near);
    e[12] = 0;       e[13] = 0;      e[14] = -1;                               e[15] = 0;

    return this;
  },

  // -------------------------------------------------------------------------
  makeOrthographic: function(left, right, top, bottom, near, far) {
    // shortcut - use in place of this.elements
    var e = this.elements;

    // todo - set every element to the appropriate value
    e[0] = 2 / (right - left); e[1] = 0;                  e[2] = 0;                   e[3] = -(right + left) / (right - left);
    e[4] = 0;                 e[5] = 2 / (top - bottom);  e[6] = 0;                   e[7] = -(top + bottom) / (top - bottom);
    e[8] = 0;                 e[9] = 0;                  e[10] = -2 / (far - near);   e[11] = -(far + near) / (far - near);
    e[12] = 0;                e[13] = 0;                 e[14] = 0;                   e[15] = 1;

    return this;
  },

  // -------------------------------------------------------------------------
  // @translation - a Matrix4 translation matrix
  // @rotation - a Matrix4 rotation Matrix
  // @scale - a Matrix4 scale matrix
  createTRSMatrix: function(translation, rotation, scale) {
    // todo - create a matrix that combines translation, rotation, and scale such
    //        that TRANSFORMATIONS take place in the following order: 1) scale,
    //        2) rotation, and 3) translation. The values of translation, rotation,
    //        and scale should NOT be modified.

    var trsMatrix = new Matrix4()
    .multiply(translation)  
    .multiply(rotation)     
    .multiply(scale);   
    return trsMatrix;
  },

  // -------------------------------------------------------------------------
  // @currentRotationAngle - the angle of rotation around the earth
  // @offsetFromEarth - the relative displacement from the earth
  // @earthTransform - the transformation used to apply to the earth
  createMoonMatrix: function(currentRotationAngle, offsetFromEarth, earthTransform) {

    // todo - create a matrix that combines translation and rotation such that when
    var rotationMatrix = new Matrix4().makeRotationZ(currentRotationAngle);
    //        it is applied to a sphere starting at the origin, moves the sphere to 
    //        orbit the earth.  The displacement from the earth is given by  
    var translationMatrix = new Matrix4().makeTranslation(offsetFromEarth.x, offsetFromEarth.y, offsetFromEarth.z);
    //        "offsetFromEarth" and the current rotation around the earth (z-axis)
    //        is given by "currentRotationAngle" degrees.

    // Note: Do NOT change earthTransform but do use it, it already has the rotation and translation for the earth

    var moonMatrix = new Matrix4()
        .copy(earthTransform)         // Start with the earth's transformation
        .multiply(rotationMatrix)     // Apply rotation for the moon's orbit
        .multiply(translationMatrix);

    // todo - combine all necessary matrices necessary to achieve the desired effect

    return moonMatrix;
  },

  // -------------------------------------------------------------------------
  determinant: function() {
    var e = this.elements;

    // laid out for clarity, not performance
    var m11 = e[0]; var m12 = e[1]; var m13 = e[2]; var m14 = e[3];
    var m21 = e[4]; var m22 = e[5]; var m23 = e[6]; var m24 = e[7];
    var m31 = e[8]; var m32 = e[8]; var m33 = e[9]; var m34 = e[10];
    var m41 = e[12]; var m42 = e[13]; var m43 = e[14]; var m44 = e[15];

    var det11 = m11 * (m22 * (m33 * m44 - m34 * m43) +
      m23 * (m34 * m42 - m32 * m44) +
      m24 * (m32 * m43 - m33 * m42));

    var det12 = -m12 * (m21 * (m33 * m44 - m34 * m43) +
      m23 * (m34 * m41 - m31 * m44) +
      m24 * (m31 * m43 - m33 * m41));

    var det13 = m13 * (m21 * (m32 * m44 - m34 * m42) +
      m22 * (m34 * m41 - m31 * m44) +
      m24 * (m31 * m42 - m32 * m41));

    var det14 = -m14 * (m21 * (m32 * m43 - m33 * m42) +
      m22 * (m33 * m41 - m31 * m43) +
      m23 * (m31 * m42 - m32 * m41));

    return det11 + det12 + det13 + det14;
  },

  // -------------------------------------------------------------------------
  transpose: function() {
    var te = this.elements;
    var tmp;

    tmp = te[1]; te[1] = te[4]; te[4] = tmp;
    tmp = te[2]; te[2] = te[8]; te[8] = tmp;
    tmp = te[6]; te[6] = te[9]; te[9] = tmp;

    tmp = te[3]; te[3] = te[12]; te[12] = tmp;
    tmp = te[7]; te[7] = te[13]; te[13] = tmp;
    tmp = te[11]; te[11] = te[14]; te[14] = tmp;

    return this;
  },


  // -------------------------------------------------------------------------
  inverse: function() {
    // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    var te = this.elements,
      me = this.clone().elements,

      n11 = me[0], n21 = me[1], n31 = me[2], n41 = me[3],
      n12 = me[4], n22 = me[5], n32 = me[6], n42 = me[7],
      n13 = me[8], n23 = me[9], n33 = me[10], n43 = me[11],
      n14 = me[12], n24 = me[13], n34 = me[14], n44 = me[15],

      t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
      t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
      t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
      t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

    var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

    if (det === 0) {
      var msg = "can't invert matrix, determinant is 0";
      console.warn(msg);
      return this.makeIdentity();
    }

    var detInv = 1 / det;

    te[0] = t11 * detInv;
    te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
    te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
    te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

    te[4] = t12 * detInv;
    te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
    te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
    te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

    te[8] = t13 * detInv;
    te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
    te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
    te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

    te[12] = t14 * detInv;
    te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
    te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
    te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

    return this;
  },

  // -------------------------------------------------------------------------
  log: function() {
    var te = this.elements;
    console.log('[ ' +
      '\n ' + te[0] + ', ' + te[1] + ', ' + te[2] + ', ' + te[3] +
      '\n ' + te[4] + ', ' + te[5] + ', ' + te[6] + ', ' + te[7] +
      '\n ' + te[8] + ', ' + te[9] + ', ' + te[10] + ', ' + te[11] +
      '\n ' + te[12] + ', ' + te[13] + ', ' + te[14] + ', ' + te[15] +
      '\n]'
    );

    return this;
  }
};

