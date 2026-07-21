/// 「错乱态」字符替换工具
///
/// 为每个字符提供一个相似字符池，在渲染错乱态时随机抽取。
/// 包含三类：拉丁字母、阿拉伯数字、常用 CJK 字。
class GarbledGlyphs {
  GarbledGlyphs._();

  /// 拉丁字母相似字符映射
  static const Map<String, List<String>> _latin = {
    'a': ['á', 'à', 'â', 'ä', 'ã', 'å', 'ā', 'æ'],
    'b': ['þ', 'ß', '6'],
    'c': ['ç', 'ć', 'ĉ', 'č'],
    'd': ['đ', 'ð', 'ɖ'],
    'e': ['é', 'è', 'ê', 'ë', 'ē', 'ę'],
    'f': ['ƒ'],
    'g': ['ğ', 'ĝ', 'ġ', 'ģ'],
    'h': ['ĥ', 'ħ'],
    'i': ['í', 'ì', 'î', 'ï', 'ī', 'į'],
    'j': ['ĵ'],
    'k': ['ķ', 'ĸ'],
    'l': ['ĺ', 'ļ', 'ľ', 'ŀ', 'ł', '1'],
    'm': ['ɱ'],
    'n': ['ń', 'ñ', 'ņ', 'ň', 'ŋ'],
    'o': ['ó', 'ò', 'ô', 'ö', 'õ', 'ø', 'ō', 'œ', '0'],
    'p': ['þ', '¶'],
    'q': ['ɋ'],
    'r': ['ŕ', 'ŗ', 'ř'],
    's': ['ś', 'š', 'ş', 'ß'],
    't': ['ţ', 'ť', 'ŧ'],
    'u': ['ú', 'ù', 'û', 'ü', 'ū', 'ů', 'ű', 'ų'],
    'v': ['ʋ'],
    'w': ['ŵ', 'ω'],
    'x': ['×', '✗'],
    'y': ['ý', 'ÿ', 'ŷ'],
    'z': ['ź', 'ż', 'ž'],
  };

  /// 数字相似字符映射
  static const Map<String, List<String>> _digits = {
    '0': ['○', '◌', '◦', '0', 'ø'],
    '1': ['l', 'I', '│', '|'],
    '2': ['Ƨ', '2'],
    '3': ['Ɛ', 'ε', '3'],
    '4': ['Ꮞ', '4'],
    '5': ['Ƽ', '5'],
    '6': ['б', '6'],
    '7': ['ㄥ', '7'],
    '8': ['Ƀ', '8', '∞'],
    '9': ['9', 'ց'],
  };

  /// 通用「不可识别字符」池（用于 CJK / 标点 / 其他）
  static const List<String> _noisePool = [
    '▓', '▒', '░', '█', '■', '□', '●', '○', '◐', '◑',
    '◆', '◇', '※', '¤', '╳', '╂', '▤', '▥', '▦', '▧',
    '▨', '▩', '◢', '◣', '◤', '◥', '▰', '▱',
  ];

  /// 给定原字符 + 帧编号（用于稳定随机），返回错乱态字符
  static String substitute(String ch, int frame) {
    final lower = ch.toLowerCase();

    // 拉丁字母
    final latinEntry = _latin[lower];
    if (latinEntry != null && latinEntry.isNotEmpty) {
      final idx = (frame + ch.codeUnitAt(0)) % latinEntry.length;
      return latinEntry[idx];
    }

    // 数字
    final digitEntry = _digits[ch];
    if (digitEntry != null && digitEntry.isNotEmpty) {
      final idx = (frame + ch.codeUnitAt(0)) % digitEntry.length;
      return digitEntry[idx];
    }

    // 空格 / 换行直接保留
    if (ch.trim().isEmpty) return ch;

    // CJK / 其他字符：从噪声池里抽一个
    final idx = (frame + ch.codeUnitAt(0)) % _noisePool.length;
    return _noisePool[idx];
  }
}