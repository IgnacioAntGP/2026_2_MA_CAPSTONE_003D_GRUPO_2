const SEMESTRE_MINIMO = 1;
const SEMESTRE_MAXIMO = 20;

function normalizarTextoAcademico(valor) {
  if (typeof valor !== 'string') return null;

  const limpio = valor.trim().replace(/\s+/g, ' ');
  
  return limpio.length > 0 ? limpio : null;
}

function normalizarSemestre(valor) {
  if (valor === undefined || valor === null || valor === '') {
    return null;
  }

  if (typeof valor === 'boolean') {
    return NaN;
  }

  if (typeof valor === 'number') {
    return Number.isInteger(valor) ? valor : NaN;
  }

  const texto = String(valor).trim();
  if (!/^-?\d+$/.test(texto)) {
    return NaN;
  }

  return Number(texto);
}

function normalizarPerfilEstudiante(perfilRaw) {
  if (!perfilRaw || typeof perfilRaw !== 'object') {
    return null;
  }

  return {
    carrera: normalizarTextoAcademico(perfilRaw.carrera),
    semestre: normalizarSemestre(perfilRaw.semestre),
    institucion: normalizarTextoAcademico(perfilRaw.institucion)
  };
}

function validarSemestre(semestreNormalizado) {
  return (
    typeof semestreNormalizado === 'number' &&
    Number.isInteger(semestreNormalizado) &&
    semestreNormalizado >= SEMESTRE_MINIMO &&
    semestreNormalizado <= SEMESTRE_MAXIMO
  );
}

function validarPerfilEstudianteCreacion(perfilRaw) {
  const errores = [];
  const normalizado = normalizarPerfilEstudiante(perfilRaw);

  if (!normalizado) {
    return {
      valido: false,
      errores: ['Los datos del perfil de estudiante son inválidos.'],
      normalizado: null
    };
  }

  if (!normalizado.carrera) {
    errores.push('La carrera es obligatoria.');
  } else if (normalizado.carrera.length > 150) {
    errores.push('La carrera no puede superar los 150 caracteres.');
  }

  if (!validarSemestre(normalizado.semestre)) {
    errores.push(
      `El semestre debe ser un número entero entre ${SEMESTRE_MINIMO} y ${SEMESTRE_MAXIMO}.`
    );
  }

  if (!normalizado.institucion) {
    errores.push('La institución es obligatoria.');
  } else if (normalizado.institucion.length > 150) {
    errores.push('La institución no puede superar los 150 caracteres.');
  }

  return {
    valido: errores.length === 0,
    errores,
    normalizado
  };
}

function validarPerfilEstudianteActualizacion(perfilRaw) {
  const errores = [];
  const campos = {};

  if (!perfilRaw || typeof perfilRaw !== 'object') {
    return {
      valido: false,
      errores: ['Los datos del perfil de estudiante son inválidos.'],
      campos
    };
  }

  if (perfilRaw.carrera !== undefined) {
    const carrera = normalizarTextoAcademico(perfilRaw.carrera);
    if (!carrera) {
      errores.push('La carrera no puede estar vacía.');
    } else if (carrera.length > 150) {
      errores.push('La carrera no puede superar los 150 caracteres.');
    } else {
      campos.carrera = carrera;
    }
  }

  if (perfilRaw.semestre !== undefined) {
    const semestre = normalizarSemestre(perfilRaw.semestre);
    if (!validarSemestre(semestre)) {
      errores.push(
        `El semestre debe ser un número entero entre ${SEMESTRE_MINIMO} y ${SEMESTRE_MAXIMO}.`
      );
    } else {
      campos.semestre = semestre;
    }
  }

  if (perfilRaw.institucion !== undefined) {
    const institucion = normalizarTextoAcademico(perfilRaw.institucion);
    if (!institucion) {
      errores.push('La institución no puede estar vacía.');
    } else if (institucion.length > 150) {
      errores.push('La institución no puede superar los 150 caracteres.');
    } else {
      campos.institucion = institucion;
    }
  }

  return {
    valido: errores.length === 0,
    errores,
    campos
  };
}

module.exports = {
  SEMESTRE_MINIMO,
  SEMESTRE_MAXIMO,
  normalizarTextoAcademico,
  normalizarSemestre,
  normalizarPerfilEstudiante,
  validarSemestre,
  validarPerfilEstudianteCreacion,
  validarPerfilEstudianteActualizacion
};
