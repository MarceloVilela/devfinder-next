// Cor/forma do placeholder de carregamento, duplicada à mão em UserItem/ChannelItem/
// VideoThumbItem com espaçamento divergente entre cópias (`mb-2` em UserItem vs `mb-[3px]` nos
// outros dois — achado do fechamento v4: a divergência já era evidência viva de que as cópias
// não ficam em sincronia). `SKELETON_BAR_CLASSNAME` cobre a barra de texto (idêntica nos 3, só
// UserItem precisa de `flex-1` adicional); `SKELETON_COLOR_CLASSNAME` cobre só a cor, pros
// círculos de avatar, que têm tamanho diferente em cada componente.
export const SKELETON_COLOR_CLASSNAME = 'bg-[#ccc]';
export const SKELETON_BAR_CLASSNAME = `h-4 mb-[3px] rounded-[6px] ${SKELETON_COLOR_CLASSNAME}`;
