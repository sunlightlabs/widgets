module ApplicationHelper

  def long_title title
    return "Representative" if title == "Rep"
    return "Senator" if title == "Senator"
    return "Delegate" if title == "Del"
  end

end
