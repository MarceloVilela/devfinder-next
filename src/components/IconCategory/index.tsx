'use client';

import React, { useState, ReactNode } from 'react'

import {
  MdGamepad,
  MdNetworkCheck,
  MdLaptop,
  MdSecurity,
  MdSmartphone,
  MdVoiceChat
} from 'react-icons/md';
import {
  DiCode,
  DiCodeBadge,
  DiTerminal
} from 'react-icons/di';
import {
  RiDatabase2Line,
  RiRobotLine
} from 'react-icons/ri';

interface IconCategoryProps {
  name: string
}

interface CategoryIcon {
  [key: string]: ReactNode;
}

const Container: React.FC<IconCategoryProps> = ({ name }) => {
  const [icons] = useState<CategoryIcon>({
    "Banco de Dados & Bancos Não Relacionais ": <RiDatabase2Line />,
    "Desenvolvimento Back-End ": <DiCode />,
    "Desenvolvimento Front-End ": <DiCodeBadge />,
    "Desenvolvimento Mobile Nativo & Híbrido ": <MdSmartphone />,
    "Entrevista, Webinars & Dicas ": <MdVoiceChat />,
    "Infraestrutura 🖧": <MdNetworkCheck />,
    "Inteligência Artificial ": <RiRobotLine />,
    "Games ": <MdGamepad />,
    "Lógica de Programacao": <DiTerminal />,
    "Segurança ": <MdSecurity />
  });

  return (
    <>
      {icons[name] ? icons[name] : <MdLaptop />}
    </>
  )
}

export default Container;